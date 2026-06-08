import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Jalankan serverless function di regional Singapore agar tidak diblokir oleh firewall gateway Indonesia
export const preferredRegion = "sin1";

export async function POST(req: Request) {
  try {
    const { 
      amount, 
      customer_name, 
      message, 
      save_only, 
      ref_no, 
      qr_url, 
      payment_link, 
      is_mock, 
      force_mock 
    } = await req.json();

    // Validasi input
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 1000) {
      return NextResponse.json(
        { status: "error", message: "Nominal donasi minimal Rp 1.000" },
        { status: 400 }
      );
    }

    const name = customer_name?.trim() || "Anonim";
    const msg = message?.trim() || "";

    const apiKey = "MP-Ryezenn-1780782894";
    const { db, isMock: dbIsMock, mockDb } = await getDatabase();

    // 1. SAVE_ONLY MODE: Dipanggil dari frontend setelah browser berhasil menembak API MustikaPayment secara langsung (bypass Cloudflare)
    if (save_only && ref_no) {
      const newDonation = {
        ref_no,
        amount: parsedAmount,
        customer_name: name,
        message: msg,
        status: "pending",
        type: "QRIS",
        createdAt: new Date(),
        qr_url: qr_url || null,
        is_mock: !!is_mock,
      };

      if (dbIsMock && mockDb) {
        mockDb.donations.unshift(newDonation);
      } else if (db) {
        await db.collection("donations").insertOne(newDonation);
      }

      return NextResponse.json({
        status: "success",
        ref_no,
        qr_url,
        payment_link,
        amount: parsedAmount,
        is_mock: !!is_mock,
      });
    }

    // 2. FORCE_MOCK MODE: Dipanggil jika client juga gagal menembak MustikaPayment langsung
    if (force_mock) {
      const mockRefNo = `MOCK_QR${Date.now()}`;
      const mockQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=RyezennProjectMockDonation_Ref_${mockRefNo}_Amount_${parsedAmount}`;
      const mockPaymentLink = `https://mustikapayment.com/pay/${mockRefNo}`;

      const newDonation = {
        ref_no: mockRefNo,
        amount: parsedAmount,
        customer_name: name,
        message: msg,
        status: "pending",
        type: "QRIS",
        issuer: "MOCK_GATEWAY",
        createdAt: new Date(),
        qr_url: mockQrUrl,
        is_mock: true,
      };

      if (dbIsMock && mockDb) {
        mockDb.donations.unshift(newDonation);
      } else if (db) {
        await db.collection("donations").insertOne(newDonation);
      }

      return NextResponse.json({
        status: "success",
        ref_no: mockRefNo,
        qr_url: mockQrUrl,
        payment_link: mockPaymentLink,
        amount: parsedAmount,
        is_mock: true,
      });
    }

    // 3. REAL GATEWAY MODE (SERVER-SIDE FIRST TRY)
    const refNo = `QR${Date.now()}`;
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;
    
    const payload = new URLSearchParams();
    payload.append("amount", parsedAmount.toString());
    payload.append("product_name", `Donasi Ryezenn Project - ${name}`);
    payload.append("customer_name", name);
    payload.append("expiry", "30"); // 30 menit
    payload.append("redirect_url", `${baseUrl}/donation/${refNo}`);

    try {
      const response = await fetch("https://mustikapayment.com/api/v1/create/qris", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gateway returned HTTP ${response.status}: ${errorText.slice(0, 100)}`);
      }

      const data = await response.json();

      if (data.status !== "success") {
        throw new Error(data.message || "Gagal membuat transaksi ke gateway pembayaran");
      }

      const newDonation = {
        ref_no: data.ref_no || refNo,
        amount: parsedAmount,
        customer_name: name,
        message: msg,
        status: "pending",
        type: "QRIS",
        createdAt: new Date(),
        qr_url: data.qr_url || null,
        is_mock: false,
      };

      if (dbIsMock && mockDb) {
        mockDb.donations.unshift(newDonation);
      } else if (db) {
        await db.collection("donations").insertOne(newDonation);
      }

      return NextResponse.json({
        status: "success",
        ref_no: data.ref_no || refNo,
        qr_url: data.qr_url,
        payment_link: data.payment_link,
        amount: parsedAmount,
        is_mock: false,
      });

    } catch (gatewayError: any) {
      console.warn("⚠️ MustikaPayment Gateway server call failed, sending WAF_BLOCKED to client:", gatewayError.message);
      
      // Kembalikan status waf_blocked ke client agar client melakukan hit dari browser (residential IP)
      return NextResponse.json({
        status: "waf_blocked",
        apiKey: apiKey,
        amount: parsedAmount,
        customer_name: name,
        message: msg,
      });
    }
  } catch (error: any) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
