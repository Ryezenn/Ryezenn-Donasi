"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full py-16 md:py-24 px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 overflow-hidden border-b-4 border-brand-black dark:border-brand-white">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none z-0"></div>

      {/* Hero Content */}
      <div className="flex-1 z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
        {/* Playful Tagline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -2 }}
          transition={{ type: "spring", damping: 10 }}
          className="bg-brand-blue text-brand-white border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-6 shadow-brutal-black"
        >
          DEVELOPER COMMUNITY TOOLKIT 🛠️
        </motion.div>

        {/* Huge Skewed Comic Headers */}
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl leading-none uppercase mb-6"
        >
          Dukung <br />
          <span className="bg-brand-yellow text-brand-black border-comic px-4 inline-block transform -rotate-1 shadow-brutal-lg my-2 font-black">
            Ryezenn Project
          </span>{" "}
          <span className="inline-block animate-bounce-slow">🚀</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-comic font-bold text-lg md:text-xl max-w-xl mb-8 leading-relaxed text-zinc-700 dark:text-zinc-300"
        >
          Bantu pengembangan bot Discord, bot Telegram, website tools, dan project open source berkualitas yang bermanfaat bagi komunitas developer dan desainer.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => scrollToSection("donasi-sekarang")}
            className="px-8 py-4 bg-brand-red text-brand-white border-comic-thick font-heading text-lg tracking-wide uppercase shadow-brutal-black hover-brutal active-brutal cursor-pointer flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-brand-white" />
            Donasi Sekarang
          </button>
          
          <button
            onClick={() => scrollToSection("project")}
            className="px-8 py-4 bg-brand-white text-brand-black border-comic-thick font-heading text-lg tracking-wide uppercase shadow-brutal-black hover-brutal active-brutal cursor-pointer flex items-center justify-center gap-2"
          >
            Lihat Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Hero Interactive Illustration */}
      <div className="flex-1 z-10 w-full flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
          className="relative max-w-[400px] w-full aspect-square bg-brand-yellow dark:bg-brand-blue border-comic-thick shadow-brutal-lg flex items-center justify-center p-6 transform rotate-2"
        >
          {/* Internal Comic Panels look */}
          <div className="absolute top-2 left-2 bg-brand-white dark:bg-brand-black border-comic-thin text-xs font-heading px-2 py-0.5 tracking-wider">
            PANEL #01
          </div>

          {/* SVG Character representing Developer */}
          <svg
            viewBox="0 0 100 100"
            className="w-4/5 h-4/5 text-brand-black dark:text-brand-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Robot/Developer Face Grid */}
            <rect x="25" y="25" width="50" height="50" rx="8" fill="#FFFFFF" className="dark:fill-[#1E1E1E] border-comic-thin" />
            <rect x="20" y="45" width="10" height="10" rx="2" fill="#EF4444" />
            <rect x="70" y="45" width="10" height="10" rx="2" fill="#EF4444" />
            
            {/* Eyes */}
            <circle cx="40" cy="45" r="5" fill="#3B82F6" className="animate-pulse" />
            <circle cx="60" cy="45" r="5" fill="#3B82F6" className="animate-pulse" />
            <circle cx="40" cy="45" r="1.5" fill="#FFF" />
            <circle cx="60" cy="45" r="1.5" fill="#FFF" />
            
            {/* Antennas */}
            <line x1="50" y1="25" x2="50" y1="10" />
            <circle cx="50" cy="8" r="4" fill="#FACC15" />
            
            {/* Smile / Mouth */}
            <path d="M 40 60 Q 50 68 60 60" strokeWidth="3" />
            
            {/* Cheeks */}
            <circle cx="33" cy="53" r="2.5" fill="#EF4444" opacity="0.6" />
            <circle cx="67" cy="53" r="2.5" fill="#EF4444" opacity="0.6" />
          </svg>

          {/* Floating Comic Speech Bubble */}
          <div className="absolute -top-12 -left-4 md:-left-12 max-w-[200px] bg-brand-white text-brand-black border-comic p-3 shadow-brutal-sm speech-bubble transform -rotate-6">
            <p className="font-comic font-black text-xs md:text-sm leading-tight">
              WOI! Bantu kami bikin project open-source makin mantap! 💥
            </p>
            {/* pointer */}
            <div className="absolute bottom-[-12px] right-[40px] w-0 h-0 border-l-[8px] border-l-transparent border-t-[12px] border-t-brand-black border-r-[8px] border-r-transparent"></div>
            <div className="absolute bottom-[-8px] right-[41px] w-0 h-0 border-l-[7px] border-l-transparent border-t-[10px] border-t-brand-white border-r-[7px] border-r-transparent z-10"></div>
          </div>

          {/* Sparkles */}
          <div className="absolute -bottom-6 -right-6 bg-brand-red text-brand-white font-heading text-lg py-1 px-3 border-comic shadow-brutal-sm transform rotate-12 uppercase animate-wiggle">
            Boom!
          </div>
        </motion.div>
      </div>
    </section>
  );
}
