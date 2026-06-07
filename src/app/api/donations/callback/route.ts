import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    let payload: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        payload[key] = value;
      });
    }

    console.log("Received Webhook Callback Payload:", payload);

    const { ref_no, status, issuer } = payload;

    if (!ref_no) {
      return NextResponse.json(
        { status: "error", message: "Missing ref_no" },
        { status: 400 }
      );
    }

    const { db, isMock: dbIsMock, mockDb } = await getDatabase();

    // Validasi status
    const isSuccess = status === "success" || status === "SUCCESS";

    if (dbIsMock && mockDb) {
      const idx = mockDb.donations.findIndex((d: any) => d.ref_no === ref_no);
      if (idx !== -1) {
        mockDb.donations[idx].status = isSuccess ? "success" : "failed";
        mockDb.donations[idx].paidAt = new Date();
        mockDb.donations[idx].issuer = issuer || "QRIS";
      }
    } else if (db) {
      const updateData: any = {
        status: isSuccess ? "success" : "failed",
      };
      if (isSuccess) {
        updateData.paidAt = new Date();
        updateData.issuer = issuer || "QRIS";
      }

      await db.collection("donations").updateOne(
        { ref_no },
        { $set: updateData }
      );
    }

    return NextResponse.json({ status: "success", message: "Callback processed successfully" });
  } catch (error: any) {
    console.error("Webhook Callback Error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
