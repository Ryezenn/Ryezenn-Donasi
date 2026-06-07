import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Mark as dynamic so it doesn't cache statically during build
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db, isMock, mockDb } = await getDatabase();
    let donations: any[] = [];

    if (isMock && mockDb) {
      donations = mockDb.donations
        .filter((d: any) => d.status === "success")
        .sort((a: any, b: any) => new Date(b.paidAt || b.createdAt).getTime() - new Date(a.paidAt || a.createdAt).getTime())
        .slice(0, 10);
    } else if (db) {
      donations = await db
        .collection("donations")
        .find({ status: "success" })
        .sort({ paidAt: -1, createdAt: -1 })
        .limit(10)
        .toArray();
    }

    // Format output
    const formattedDonations = donations.map((d) => ({
      ref_no: d.ref_no,
      amount: d.amount,
      customer_name: d.customer_name || "Anonim",
      message: d.message || "",
      issuer: d.issuer || "QRIS",
      paidAt: d.paidAt || d.createdAt,
    }));

    return NextResponse.json(formattedDonations);
  } catch (error: any) {
    console.error("Error fetching recent donations:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
