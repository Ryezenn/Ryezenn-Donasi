import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { db, isMock, mockDb } = await getDatabase();
    
    let totalCollected = 0;
    let donorCount = 0;
    let leaderboard: any[] = [];
    const target = parseInt(process.env.NEXT_PUBLIC_DONATION_TARGET || "5000000", 10);

    if (isMock && mockDb) {
      const successfulDonations = mockDb.donations.filter((d: any) => d.status === "success");
      
      totalCollected = successfulDonations.reduce((sum: number, d: any) => sum + d.amount, 0);
      donorCount = successfulDonations.length;

      // Buat leaderboard (kelompokkan berdasarkan nama untuk menghitung total donasi per donatur)
      const donorGroups: Record<string, number> = {};
      successfulDonations.forEach((d: any) => {
        const name = d.customer_name || "Anonim";
        if (name.toLowerCase() !== "anonim") {
          donorGroups[name] = (donorGroups[name] || 0) + d.amount;
        }
      });

      leaderboard = Object.entries(donorGroups)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    } else if (db) {
      // Hitung total dikumpulkan dan jumlah donatur
      const stats = await db.collection("donations").aggregate([
        { $match: { status: "success" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]).toArray();

      if (stats.length > 0) {
        totalCollected = stats[0].total;
        donorCount = stats[0].count;
      }

      // Hitung leaderboard top 5 (kecuali nama "Anonim")
      leaderboard = await db.collection("donations").aggregate([
        { $match: { status: "success", customer_name: { $nin: ["Anonim", "anonim", ""] } } },
        {
          $group: {
            _id: "$customer_name",
            amount: { $sum: "$amount" },
          },
        },
        { $project: { _id: 0, name: "$_id", amount: 1 } },
        { $sort: { amount: -1 } },
        { $limit: 5 },
      ]).toArray();
    }

    // Hitung progress
    const progress = Math.min(Math.round((totalCollected / target) * 100), 100);

    return NextResponse.json({
      total_collected: totalCollected,
      donor_count: donorCount,
      target: target,
      progress: progress,
      leaderboard: leaderboard,
    });
  } catch (error: any) {
    console.error("Error fetching donation stats:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
