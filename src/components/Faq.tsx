"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  q: string;
  a: string;
}

export default function Faq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: "Bagaimana cara kerja donasi QRIS di website ini?",
      a: "Pilih nominal donasi yang Anda inginkan (atau masukkan nominal custom), tulis nama dan pesan dukungan, lalu klik bayar. Barcode QRIS dinamis akan terbuat secara instan. Buka aplikasi e-wallet Anda (GoPay, OVO, DANA, ShopeePay, LinkAja) atau m-Banking (BCA, Mandiri, dll), lalu scan barcode tersebut. Sistem kami akan mendeteksi pembayaran secara realtime dan mengarahkan Anda ke halaman sukses!",
    },
    {
      q: "Ke mana dana donasi yang terkumpul akan dialokasikan?",
      a: "Seluruh dana yang terkumpul dialokasikan untuk pemeliharaan server bot Discord & Telegram agar aktif 24/7, perpanjangan sewa domain web tools, pembiayaan kuota API kecerdasan buatan, serta dukungan konsumsi kopi bagi tim developer agar terus bersemangat menelurkan project-project open-source gratis.",
    },
    {
      q: "Apakah saya harus memasukkan nama asli?",
      a: "Tentu saja tidak! Anda bebas menggunakan nama asli, nama pena, nama samaran wibu, atau mengosongkannya sama sekali untuk berdonasi sebagai 'Anonim'. Privasi Anda sepenuhnya aman.",
    },
    {
      q: "Apakah ada nominal minimal dan batas donasi?",
      a: "Nominal donasi minimal adalah Rp 1.000 saja. Tidak ada batas maksimal donasi. Sekecil apa pun nominal yang Anda kirimkan, dukungan tersebut sangat berarti bagi keberlangsungan project kami!",
    },
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full py-16 md:py-24 px-6 md:px-12 border-b-4 border-brand-black dark:border-brand-white bg-brand-white dark:bg-[#121214] transition-colors relative">
      <div className="max-w-3xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <div className="bg-brand-red text-brand-white border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-4 shadow-brutal-black">
            Tanya Jawab 💬
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl uppercase leading-none mt-2 text-brand-black dark:text-brand-white">
            FAQ KOMIK SECTION
          </h2>
          <p className="font-comic font-bold text-zinc-500 dark:text-zinc-400 mt-4 max-w-xl mx-auto text-xs md:text-sm">
            Temukan jawaban atas pertanyaan umum seputar donasi Ryezenn Project di bawah ini.
          </p>
        </div>

        {/* Accordion Panels */}
        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            const bubbleColors = [
              "bg-brand-yellow/10 hover:bg-brand-yellow/20 dark:bg-brand-yellow/5",
              "bg-brand-blue/10 hover:bg-brand-blue/20 dark:bg-brand-blue/5",
              "bg-brand-red/10 hover:bg-brand-red/20 dark:bg-brand-red/5",
              "bg-brand-green/10 hover:bg-brand-green/20 dark:bg-brand-green/5",
            ];
            const colorClass = bubbleColors[index % bubbleColors.length];
            
            return (
              <div
                key={index}
                className="flex flex-col rounded-none"
              >
                {/* Accordion Header - Comic speech bubble feel */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`w-full text-left p-5 border-comic-thick ${colorClass} text-brand-black dark:text-brand-white font-heading text-base md:text-lg uppercase tracking-wide flex items-center justify-between shadow-brutal-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer rounded-none focus:outline-none`}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-red dark:text-brand-yellow flex-shrink-0" />
                    <span className="leading-tight pr-4">{faq.q}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-6 h-6 flex-shrink-0 text-brand-black dark:text-brand-white" />
                  ) : (
                    <ChevronDown className="w-6 h-6 flex-shrink-0 text-brand-black dark:text-brand-white" />
                  )}
                </button>

                {/* Accordion Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-x-4 border-b-4 border-brand-black dark:border-brand-white p-5 bg-brand-white dark:bg-[#1E1E1E] shadow-brutal-sm text-brand-black dark:text-brand-white rounded-none relative">
                        {/* Comic-style Inner Speech Arrow pointer */}
                        <div className="absolute top-[-10px] left-8 w-0 h-0 border-l-[10px] border-l-transparent border-b-[10px] border-b-brand-black dark:border-b-brand-white border-r-[10px] border-r-transparent"></div>
                        
                        <p className="font-comic font-bold text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-2">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
