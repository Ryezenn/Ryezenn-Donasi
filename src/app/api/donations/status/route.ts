import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Jalankan serverless function di regional Singapore agar tidak diblokir oleh firewall gateway Indonesia
export const preferredRegion = "sin1";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ref_no = searchParams.get("ref_no");

    if (!ref_no) {
      return NextResponse.json(
        { status: "error", message: "Parameter ref_no tidak ditemukan" },
        { status: 400 }
      );
    }

    const { db, isMock: dbIsMock, mockDb } = await getDatabase();
    let donation: any = null;

    // Cari transaksi di database
    if (dbIsMock && mockDb) {
      donation = mockDb.donations.find((d: any) => d.ref_no === ref_no);
    } else if (db) {
      donation = await db.collection("donations").findOne({ ref_no });
    }

    if (!donation) {
      return NextResponse.json(
        { status: "error", message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika status masih pending, lakukan pengecekan
    if (donation.status === "pending") {
      const isMockRef = ref_no.startsWith("MOCK_");
      
      if (isMockRef) {
        // MOCK MODE: Otomatis sukses setelah 12 detik sejak dibuat
        const timeElapsed = Date.now() - new Date(donation.createdAt).getTime();
        if (timeElapsed > 12000) { // 12 detik
          donation.status = "success";
          donation.paidAt = new Date();
          donation.issuer = ["GOPAY", "OVO", "DANA", "SHOPEEPAY", "LINKAJA"][Math.floor(Math.random() * 5)];

          // Update data di database
          if (db) {
            await db.collection("donations").updateOne(
              { ref_no },
              { $set: { status: "success", paidAt: donation.paidAt, issuer: donation.issuer } }
            );
          }
        }
      } else {
        // REAL MODE: Panggil status API MustikaPayment
        const apiKey = process.env.MUSTIKA_API_KEY;
        if (apiKey) {
          const response = await fetch(`https://mustikapayment.com/api/v1/check/qris?ref_no=${ref_no}`, {
            method: "GET",
            headers: {
              "X-Api-Key": apiKey,
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("MustikaPayment QRIS Check HTTP Error:", response.status, errorText);
            return NextResponse.json(
              { 
                status: "error", 
                message: `Gateway check returned status ${response.status}.` 
              },
              { status: response.status }
            );
          }

          const apiRes = await response.json();
          console.log("MustikaPayment Check QRIS Response:", apiRes);

          // Pengecekan status pembayaran yang aman:
          // Biasanya API membungkus detail transaksi di dalam objek 'data'.
          // Jadi kita cek apiRes.data.status terlebih dahulu, baru fallback ke apiRes.status.
          const paymentStatus = apiRes.data?.status || apiRes.status;
          const issuer = apiRes.data?.issuer || apiRes.issuer || "QRIS";
          const settleAt = apiRes.data?.settle_at || apiRes.settle_at;

          if (paymentStatus === "success" || paymentStatus === "SUCCESS") {
            donation.status = "success";
            donation.paidAt = settleAt ? new Date(settleAt) : new Date();
            donation.issuer = issuer;

            // Update database
            if (dbIsMock && mockDb) {
              const idx = mockDb.donations.findIndex((d: any) => d.ref_no === ref_no);
              if (idx !== -1) {
                mockDb.donations[idx] = { ...donation };
              }
            } else if (db) {
              await db.collection("donations").updateOne(
                { ref_no },
                { $set: { status: "success", paidAt: donation.paidAt, issuer: donation.issuer } }
              );
            }
          } else if (paymentStatus === "failed" || paymentStatus === "FAILED") {
            donation.status = "failed";
            if (dbIsMock && mockDb) {
              const idx = mockDb.donations.findIndex((d: any) => d.ref_no === ref_no);
              if (idx !== -1) {
                mockDb.donations[idx].status = "failed";
              }
            } else if (db) {
              await db.collection("donations").updateOne(
                { ref_no },
                { $set: { status: "failed" } }
              );
            }
          }
        }
      }
    }

    return NextResponse.json({
      ref_no: donation.ref_no,
      status: donation.status,
      amount: donation.amount,
      customer_name: donation.customer_name,
      message: donation.message,
      issuer: donation.issuer || null,
      paidAt: donation.paidAt || null,
      qr_url: donation.qr_url || null,
    });
  } catch (error: any) {
    console.error("Error checking status:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
