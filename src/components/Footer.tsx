"use client";

import { Send, MessageSquare, Heart } from "lucide-react";

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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: GithubIcon,
      color: "bg-brand-white text-brand-black dark:bg-brand-black dark:text-brand-white",
    },
    {
      name: "Telegram",
      url: "https://telegram.org",
      icon: Send,
      color: "bg-brand-blue text-brand-white",
    },
    {
      name: "Discord",
      url: "https://discord.com",
      icon: MessageSquare,
      color: "bg-purple-600 text-brand-white",
    },
  ];


  return (
    <footer className="w-full bg-brand-white dark:bg-[#121214] border-t-4 border-brand-black dark:border-brand-white py-12 px-6 md:px-12 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-brand-red text-brand-white border-comic px-3 py-1 font-heading text-xl uppercase tracking-wider transform -rotate-1 shadow-brutal-sm">
              Ryezenn
            </div>
            <div className="bg-brand-yellow text-brand-black border-comic px-3 py-1 font-heading text-xl uppercase tracking-wider transform rotate-1 shadow-brutal-sm">
              Project
            </div>
          </div>
          <p className="font-comic font-bold text-xs text-zinc-500 dark:text-zinc-400 max-w-[300px] mt-2 leading-relaxed">
            Membangun komunitas developer & open source yang ramah, kreatif, dan inovatif.
          </p>
        </div>

        {/* Right Side: Social badging & copyright */}
        <div className="flex flex-col items-center md:items-end gap-4">
          
          {/* Social Badges Grid */}
          <div className="flex items-center gap-3">
            {socialLinks.map((soc, idx) => {
              const IconComponent = soc.icon;
              return (
                <a
                  key={idx}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 border-comic shadow-brutal-sm hover-brutal active-brutal transition-all ${soc.color} flex items-center justify-center`}
                  aria-label={`Kunjungi Ryezenn di ${soc.name}`}
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright notice */}
          <div className="text-center md:text-right mt-2">
            <p className="font-comic font-black text-xs text-brand-black dark:text-brand-white flex items-center justify-center md:justify-end gap-1">
              Dibuat dengan <Heart className="w-3.5 h-3.5 fill-brand-red text-brand-red animate-pulse" /> oleh Ryezenn Team.
            </p>
            <p className="font-comic font-bold text-[10px] text-zinc-400 dark:text-zinc-500 mt-1">
              &copy; {currentYear} Ryezenn Project. All Rights Reserved.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
