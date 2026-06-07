"use client";

import { motion } from "framer-motion";
import { MessageSquare, Bot, Globe, Code, Brain } from "lucide-react";

export default function About() {
  const cards = [
    {
      title: "Pengembangan Bot Discord",
      icon: MessageSquare,
      color: "bg-brand-yellow",
      textColor: "text-brand-black",
      desc: "Membuat bot moderasi, bot musik, dan bot game interaktif untuk mengelola komunitas server Anda secara otomatis dan seru.",
      panel: "PANEL #A",
    },
    {
      title: "Pengembangan Bot Telegram",
      icon: Bot,
      color: "bg-brand-blue",
      textColor: "text-brand-white",
      desc: "Membangun bot asisten grup, bot notifikasi trading, bot utilitas, dan bot downloader yang responsif serta mudah digunakan.",
      panel: "PANEL #B",
    },
    {
      title: "Website Tools Praktis",
      icon: Globe,
      color: "bg-brand-red",
      textColor: "text-brand-white",
      desc: "Menyediakan aplikasi web gratis seperti PDF Converter, Image Compressor, JSON formatter, dan web developer tools gratis.",
      panel: "PANEL #C",
    },
    {
      title: "Open Source Libraries",
      icon: Code,
      color: "bg-brand-green",
      textColor: "text-brand-white",
      desc: "Mempublikasikan modul npm, library python, dan boilerplate gratis di GitHub yang membantu developer mempercepat waktu coding.",
      panel: "PANEL #D",
    },
    {
      title: "AI Tools Terintegrasi",
      icon: Brain,
      color: "bg-brand-yellow",
      textColor: "text-brand-black",
      desc: "Mengintegrasikan model kecerdasan buatan (OpenAI, Gemini, dll) ke dalam bot chat dan website tools untuk menjawab pertanyaan cerdas.",
      panel: "PANEL #E",
    },
  ];

  return (
    <section id="tentang" className="w-full py-16 md:py-24 px-6 md:px-12 border-b-4 border-brand-black dark:border-brand-white bg-brand-white dark:bg-[#121214] transition-colors relative">
      {/* Skewed Title Banner */}
      <div className="text-center mb-16">
        <div className="bg-brand-red text-brand-white border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-4 shadow-brutal-black">
          Misi Ryezenn Project 🛡️
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl uppercase leading-none mt-2">
          APA YANG KAMI KEMBANGKAN?
        </h2>
        <p className="font-comic font-bold text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mt-4 text-sm md:text-base">
          Seluruh project kami didedikasikan untuk memudahkan hidup developer dan komunitas online secara gratis.
        </p>
      </div>

      {/* Grid of Comic Panels */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border-comic-thick bg-brand-white dark:bg-[#1E1E1E] p-6 shadow-brutal-black hover-brutal transition-all flex flex-col justify-between relative h-[280px]"
            >
              {/* Comic Panel Corner Marker */}
              <div className="absolute top-2 left-2 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black font-heading text-[10px] px-2 py-0.5 border-comic-thin tracking-widest">
                {card.panel}
              </div>

              {/* Icon Container with offset shadow */}
              <div className={`w-12 h-12 rounded-none border-comic ${card.color} ${card.textColor} flex items-center justify-center shadow-brutal-sm mt-4`}>
                <IconComponent className="w-6 h-6" />
              </div>

              {/* Card Title */}
              <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wide mt-4 text-brand-black dark:text-brand-white">
                {card.title}
              </h3>

              {/* Card Description */}
              <p className="font-comic font-bold text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-4 leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          );
        })}
        
        {/* Call-to-action comic panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="border-comic-thick bg-brand-yellow dark:bg-brand-blue p-6 shadow-brutal-lg flex flex-col justify-center items-center text-center transform -rotate-1 relative h-[280px]"
        >
          <div className="absolute top-2 left-2 bg-brand-black text-brand-white border-comic-thin text-[10px] px-2 py-0.5 tracking-widest font-heading">
            JOIN US! 💥
          </div>
          <span className="text-4xl mb-3">🤝</span>
          <h3 className="font-heading text-xl md:text-2xl uppercase tracking-wider text-brand-black dark:text-brand-white">
            Punya Ide Keren?
          </h3>
          <p className="font-comic font-black text-xs md:text-sm mt-2 text-brand-black dark:text-brand-white max-w-[220px]">
            Tulis ide project-mu di pesan donasi, dan kita bisa kembangkan bersama komunitas!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
