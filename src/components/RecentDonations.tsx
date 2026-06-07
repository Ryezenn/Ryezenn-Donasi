"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Heart, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Donation {
  ref_no: string;
  amount: number;
  customer_name: string;
  message: string;
  issuer: string;
  paidAt: string;
}

export default function RecentDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecent = async () => {
    try {
      const response = await fetch("/api/donations/recent");
      const result = await response.json();
      setDonations(result);
    } catch (err) {
      console.error("Error fetching recent donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
    // Live polling setiap 20 detik
    const interval = setInterval(fetchRecent, 20000);
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

  const getTimeAgo = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const now = Date.now();
    const diffMins = Math.floor((now - time) / (1000 * 60));
    
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-12 border-b-4 border-brand-black dark:border-brand-white bg-brand-white dark:bg-[#1E1E1E] transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="bg-brand-blue text-brand-white border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-4 shadow-brutal-black">
            Daftar Pahlawan 🛡️
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl uppercase leading-none mt-2 text-brand-black dark:text-brand-white">
            DONASI TERBARU REALTIME
          </h2>
          <p className="font-comic font-bold text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mt-4 text-xs md:text-sm">
            Terima kasih yang sebesar-besarnya kepada para pendukung setia yang telah membantu perkembangan Ryezenn Project!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <span className="inline-block border-comic p-3 bg-brand-yellow font-heading text-sm animate-bounce">
              MEMUAT DATA DONASI... ⚡
            </span>
          </div>
        ) : donations.length === 0 ? (
          <div className="border-comic bg-brand-white dark:bg-brand-black p-8 text-center shadow-brutal-black">
            <p className="font-comic font-black text-sm text-zinc-500">
              Belum ada riwayat donasi sukses terdaftar. Jadilah donatur pertama kami! 💪
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <AnimatePresence>
              {donations.map((item, index) => {
                const avatarColors = [
                  "bg-brand-yellow",
                  "bg-brand-blue",
                  "bg-brand-red",
                  "bg-brand-green",
                ];
                const bgAvatar = avatarColors[index % avatarColors.length];
                
                return (
                  <motion.div
                    key={item.ref_no}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex gap-4 md:gap-6 items-start"
                  >
                    {/* Character Avatar */}
                    <div className={`w-12 h-12 md:w-16 md:h-16 border-comic-thick ${bgAvatar} text-brand-black rounded-none flex items-center justify-center font-heading text-xl md:text-3xl shadow-brutal-sm flex-shrink-0 transform rotate-3 hover:rotate-0 transition-transform`}>
                      {item.customer_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Speech Bubble Card */}
                    <div className="flex-1 border-comic-thick bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white p-4 md:p-6 shadow-brutal-black relative rounded-none">
                      {/* Bubble Pointer Left */}
                      <div className="absolute left-[-16px] top-6 md:top-8 w-0 h-0 border-r-[16px] border-r-brand-black dark:border-r-brand-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent"></div>
                      <div className="absolute left-[-11px] top-[26px] md:top-[34px] w-0 h-0 border-r-[12px] border-r-brand-white dark:border-r-brand-black border-t-[9px] border-t-transparent border-b-[9px] border-b-transparent z-10"></div>

                      {/* Header Row: Name & Amount */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-zinc-300 dark:border-zinc-700 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="bg-brand-yellow text-brand-black border-comic-thin px-2 py-0.5 font-heading text-xs tracking-wider uppercase">
                            {item.customer_name}
                          </span>
                          <span className="font-comic font-bold text-[10px] text-zinc-500 dark:text-zinc-400">
                            {getTimeAgo(item.paidAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm md:text-base text-brand-red dark:text-brand-yellow">
                            {formatIDR(item.amount)}
                          </span>
                          <span className="bg-brand-blue text-brand-white border-comic-thin px-1.5 py-0.5 font-heading text-[9px] uppercase tracking-wide">
                            {item.issuer}
                          </span>
                        </div>
                      </div>

                      {/* Content Row: Message */}
                      <div className="flex gap-2 items-start font-comic font-black text-xs md:text-sm text-zinc-700 dark:text-zinc-300">
                        <MessageSquare className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                        <p className="italic leading-relaxed break-words">
                          "{item.message || "Mendukung Ryezenn Project tanpa pesan 💖"}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
