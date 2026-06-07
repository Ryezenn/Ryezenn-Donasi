import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { amount, customer_name, message } = await req.json();

    // Validasi input
    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount < 1000) {
      return NextResponse.json(
        { status: "error", message: "Nominal donasi minimal Rp 1.000" },
        { status: 400 }
      )
    }

    const name = customer_name?.trim() || "Anonim";
    const msg = message?.trim() || "";

    const apiKey = process.env.MUSTIKA_API_KEY;
    const isMock = !apiKey;

    const { db, isMock: dbIsMock, mockDb } = await getDatabase();

    if (isMock) {
      // MOCK MODE
      const mockRefNo = `MOCK_QR${Date.now()}`;
      // Gunakan link QR code ilustrasi/dummy
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
    } else {
      // REAL GATEWAY MODE
      const refNo = `QR${Date.now()}`;
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      
      const payload = new URLSearchParams();
      payload.append("amount", parsedAmount.toString());
      payload.append("product_name", `Donasi Ryezenn Project - ${name}`);
      payload.append("customer_name", name);
      payload.append("expiry", "30"); // 30 menit
      payload.append("redirect_url", `${baseUrl}/donation/${refNo}`);

      const response = await fetch("https://mustikapayment.com/api/v1/create/qris", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      const data = await response.json();

      if (data.status !== "success") {
        return NextResponse.json(
          { status: "error", message: data.message || "Gagal membuat transaksi ke gateway pembayaran" },
          { status: 500 }
        );
      }

      const newDonation = {
        ref_no: data.ref_no || refNo,
        amount: parsedAmount,
        customer_name: name,
        message: msg,
        status: "pending",
        type: "QRIS",
        createdAt: new Date(),
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
    }
  } catch (error: any) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
