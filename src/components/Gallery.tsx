"use client";

import { motion } from "framer-motion";
import { MessageSquare, Bot, Globe, Brain, ExternalLink } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}


export default function Gallery() {
  const projects = [
    {
      title: "Ryezenn Discord Bot",
      desc: "Bot multifungsi untuk pemutaran musik HQ, moderasi grup otomatis dengan filter spam pintar, dan mini-games ekonomi RPG.",
      badge: "POPULAR 🔥",
      color: "from-brand-blue to-purple-600",
      icon: MessageSquare,
      github: "https://github.com",
      demo: "https://discord.com",
      panel: "01",
    },
    {
      title: "AutoNotifier Telegram Bot",
      desc: "Bot broadcast terintegrasi yang mengirimkan update otomatis dari GitHub, feed blog, RSS, dan notifikasi server realtime.",
      badge: "ACTIVE ⚡",
      color: "from-brand-green to-emerald-600",
      icon: Bot,
      github: "https://github.com",
      demo: "https://telegram.org",
      panel: "02",
    },
    {
      title: "Ryezenn Developer Tools",
      desc: "Koleksi web tools online super cepat untuk formatter JSON, minifier CSS/JS, pembuat QR code, dan konverter regex.",
      badge: "NEW ✨",
      color: "from-brand-yellow to-amber-500",
      icon: Globe,
      github: "https://github.com",
      demo: "https://google.com",
      panel: "03",
    },
    {
      title: "Aura-AI Chat Assistant",
      desc: "Bot berbasis AI LLM (Gemini API) yang membantu menjawab pertanyaan pemrograman, debugging kode, dan optimasi query database.",
      badge: "BETA 🧠",
      color: "from-brand-red to-pink-600",
      icon: Brain,
      github: "https://github.com",
      demo: "https://google.com",
      panel: "04",
    },
  ];

  return (
    <section id="project" className="w-full py-16 md:py-24 px-6 md:px-12 border-b-4 border-brand-black dark:border-brand-white bg-brand-yellow/5 dark:bg-[#1E1E1E]/50 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <div className="bg-brand-yellow text-brand-black border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-4 shadow-brutal-black">
              Showcase Karya 🎨
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl uppercase leading-none mt-2 text-brand-black dark:text-brand-white">
              GALERI PROJECT KAMI
            </h2>
            <p className="font-comic font-bold text-zinc-500 dark:text-zinc-400 mt-4 max-w-xl text-xs md:text-sm">
              Lihat koleksi project buatan Ryezenn Project yang saat ini aktif dikembangkan dan bisa dicoba secara gratis!
            </p>
          </div>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black border-comic font-heading text-sm uppercase tracking-wider shadow-brutal-black hover-brutal active-brutal flex items-center justify-center gap-2 max-w-[200px]"
          >
            <GithubIcon className="w-5 h-5" />
            GitHub Kami
          </a>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => {
            const IconComponent = proj.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="border-comic-thick bg-brand-white dark:bg-[#1E1E1E] p-6 shadow-brutal-black flex flex-col justify-between relative rounded-none hover-brutal"
              >
                {/* Panel Corner Number */}
                <div className="absolute top-2 left-2 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black font-heading text-[10px] px-2 py-0.5 border-comic-thin tracking-widest">
                  PROJECT #{proj.panel}
                </div>

                {/* Status Badge */}
                <div className="absolute -top-3 right-6 bg-brand-red text-brand-white font-heading text-xs px-3 py-1 uppercase tracking-wider border-comic shadow-brutal-sm transform rotate-2">
                  {proj.badge}
                </div>

                {/* Graphical Mockup representation using CSS Gradient */}
                <div className={`w-full h-44 bg-gradient-to-br ${proj.color} border-comic-thick shadow-brutal-sm rounded-none mt-4 flex items-center justify-center relative overflow-hidden group`}>
                  {/* Decorative Comic Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Floating Icon */}
                  <IconComponent className="w-16 h-16 text-brand-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-[4px_4px_0px_#000]" />
                  
                  {/* Comic sound effect bubble */}
                  <div className="absolute bottom-2 right-2 bg-brand-yellow text-brand-black font-heading text-[10px] px-2 py-0.5 border-comic-thin transform -rotate-6 uppercase">
                    Zap!
                  </div>
                </div>

                {/* Info block */}
                <div className="my-6">
                  <h3 className="font-heading text-2xl uppercase tracking-wide text-brand-black dark:text-brand-white">
                    {proj.title}
                  </h3>
                  <p className="font-comic font-bold text-xs md:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                {/* Action Row */}
                <div className="flex gap-4 border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 pt-4">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-brand-white text-brand-black border-comic font-heading text-xs uppercase tracking-wider text-center shadow-brutal-sm hover-brutal active-brutal flex items-center justify-center gap-1.5"
                  >
                    <GithubIcon className="w-4 h-4" />
                    Source
                  </a>
                  
                  <a
                    href={proj.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-brand-yellow text-brand-black border-comic font-heading text-xs uppercase tracking-wider text-center shadow-brutal-sm hover-brutal active-brutal flex items-center justify-center gap-1.5"
                  >
                    Coba Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
