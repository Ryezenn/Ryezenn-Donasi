"use client";

import { useEffect, useState } from "react";
import { Users, Target, Coins, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardItem {
  name: string;
  amount: number;
}

interface StatsData {
  total_collected: number;
  donor_count: number;
  target: number;
  progress: number;
  leaderboard: LeaderboardItem[];
}

export default function Stats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/donations/stats");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds for live updates
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-6 flex items-center justify-center">
        <div className="border-comic p-6 bg-brand-yellow font-heading text-xl shadow-brutal-black animate-bounce-slow">
          LOADING STATS... ⚡
        </div>
      </div>
    );
  }

  const stats = data || {
    total_collected: 0,
    donor_count: 0,
    target: 5000000,
    progress: 0,
    leaderboard: [],
  };

  return (
    <section className="w-full py-16 px-6 md:px-12 border-b-4 border-brand-black dark:border-brand-white bg-brand-white dark:bg-[#1E1E1E] transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left column: Key stats & Progress bar */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-brand-red text-brand-white border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-6 shadow-brutal-black self-start">
            Pencapaian Donasi 📊
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl uppercase mb-8">
            Perjalanan Target Bulanan Kami
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Stat Item 1 */}
            <div className="bg-brand-yellow text-brand-black border-comic p-5 shadow-brutal-black flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-comic font-black text-xs uppercase tracking-wide">Terkumpul</span>
                <Coins className="w-5 h-5 text-brand-black" />
              </div>
              <span className="font-heading text-xl sm:text-2xl leading-none">
                {formatIDR(stats.total_collected)}
              </span>
            </div>

            {/* Stat Item 2 */}
            <div className="bg-brand-blue text-brand-white border-comic p-5 shadow-brutal-black flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-comic font-black text-xs uppercase tracking-wide">Donatur</span>
                <Users className="w-5 h-5 text-brand-white" />
              </div>
              <span className="font-heading text-xl sm:text-2xl leading-none">
                {stats.donor_count} Pahlawan
              </span>
            </div>

            {/* Stat Item 3 */}
            <div className="bg-brand-white text-brand-black border-comic p-5 shadow-brutal-black flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-comic font-black text-xs uppercase tracking-wide">Target</span>
                <Target className="w-5 h-5 text-brand-black" />
              </div>
              <span className="font-heading text-xl sm:text-2xl leading-none">
                {formatIDR(stats.target)}
              </span>
            </div>
          </div>

          {/* Progress Bar Comic Style */}
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-end font-comic font-black text-sm uppercase">
              <span>Progress Bar</span>
              <span className="font-heading text-xl text-brand-red dark:text-brand-yellow">
                {stats.progress}%
              </span>
            </div>
            
            <div className="w-full h-8 bg-brand-white border-comic overflow-hidden relative shadow-brutal-black">
              {/* Striped Background */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_50%,#ccc_50%,#ccc_75%,transparent_75%,transparent)] [background-size:20px_20px] opacity-10"></div>
              
              {/* Progress Fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full bg-brand-red border-r-4 border-brand-black flex items-center justify-end pr-2 overflow-hidden"
              >
                <div className="h-full w-full bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] [background-size:20px_20px] animate-[wiggle_1.5s_linear_infinite]"></div>
              </motion.div>
            </div>
            
            <p className="font-comic font-bold text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              * Diperbarui secara otomatis setiap kali ada donasi QRIS yang berhasil masuk.
            </p>
          </div>
        </div>

        {/* Right column: Leaderboard */}
        <div className="w-full lg:w-[400px]">
          <div className="border-comic-thick bg-brand-yellow dark:bg-[#2A2A30] p-6 shadow-brutal-lg relative transform rotate-1">
            {/* Panel Badge */}
            <div className="absolute -top-5 left-6 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black font-heading text-xs px-3 py-1 uppercase tracking-widest border-comic-thin">
              LEADERBOARD HEROES 🏆
            </div>

            <div className="flex items-center gap-2 mb-6 mt-2">
              <Trophy className="w-6 h-6 text-brand-red animate-bounce" />
              <h3 className="font-heading text-2xl uppercase tracking-wider text-brand-black dark:text-brand-white">
                Donatur Terbesar
              </h3>
            </div>

            {stats.leaderboard.length === 0 ? (
              <div className="border-comic-thin border-dashed bg-brand-white dark:bg-brand-black p-4 text-center">
                <p className="font-comic font-bold text-sm text-zinc-500 dark:text-zinc-400">
                  Belum ada donatur terdaftar. Jadilah pahlawan pertama kami! 🦸‍♂️
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {stats.leaderboard.map((hero, index) => {
                  const medals = ["🥇", "🥈", "🥉", "🎖️", "🎖️"];
                  const colors = [
                    "bg-brand-white text-brand-black",
                    "bg-brand-white text-brand-black",
                    "bg-brand-white text-brand-black",
                    "bg-brand-white text-brand-black",
                    "bg-brand-white text-brand-black",
                  ];
                  return (
                    <div
                      key={index}
                      className={`border-comic p-3 flex items-center justify-between shadow-brutal-sm bg-brand-white dark:bg-brand-black dark:text-brand-white hover-brutal`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{medals[index]}</span>
                        <span className="font-comic font-black text-sm uppercase truncate max-w-[150px]">
                          {hero.name}
                        </span>
                      </div>
                      <span className="font-heading text-sm text-brand-red dark:text-brand-yellow">
                        {formatIDR(hero.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="font-comic font-bold text-xs text-brand-black dark:text-zinc-300">
                Peringkat dihitung berdasarkan total donasi yang masuk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
