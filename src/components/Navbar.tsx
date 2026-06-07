"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, Rocket, Heart } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-white dark:bg-brand-black border-b-4 border-brand-black dark:border-brand-white py-4 px-6 md:px-12 flex items-center justify-between transition-colors">
      {/* Brand Logo - Comic Style skew */}
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center gap-2 cursor-pointer select-none group"
      >
        <div className="bg-brand-red text-brand-white border-comic px-3 py-1 font-heading text-lg md:text-2xl tracking-wider uppercase transform -rotate-2 group-hover:rotate-2 group-hover:scale-105 transition-all shadow-brutal-black">
          Ryezenn
        </div>
        <div className="bg-brand-yellow text-brand-black border-comic px-3 py-1 font-heading text-lg md:text-2xl tracking-wider uppercase transform rotate-2 group-hover:-rotate-2 group-hover:scale-105 transition-all shadow-brutal-black">
          Project 🚀
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-6 font-comic font-bold text-sm lg:text-base">
        <button 
          onClick={() => scrollToSection("tentang")} 
          className="px-4 py-2 hover:bg-brand-yellow hover:text-brand-black dark:hover:text-brand-black border-4 border-transparent hover:border-brand-black dark:hover:border-brand-black transform hover:-rotate-1 transition-all rounded-none cursor-pointer"
        >
          Tentang Kami
        </button>
        <button 
          onClick={() => scrollToSection("project")} 
          className="px-4 py-2 hover:bg-brand-blue hover:text-brand-white border-4 border-transparent hover:border-brand-black transform hover:rotate-1 transition-all rounded-none cursor-pointer"
        >
          Gallery Project
        </button>
        <button 
          onClick={() => scrollToSection("faq")} 
          className="px-4 py-2 hover:bg-brand-red hover:text-brand-white border-4 border-transparent hover:border-brand-black transform hover:-rotate-2 transition-all rounded-none cursor-pointer"
        >
          Tanya Jawab
        </button>
        <button 
          onClick={() => scrollToSection("donasi-sekarang")} 
          className="px-5 py-2.5 bg-brand-red text-brand-white border-comic font-heading text-sm uppercase tracking-wide shadow-brutal-black hover-brutal active-brutal cursor-pointer flex items-center gap-2"
        >
          <Heart className="w-4 h-4 fill-brand-white animate-pulse" />
          Donasi
        </button>
        <div className="border-l-4 border-brand-black dark:border-brand-white h-8 pl-4 flex items-center">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center gap-3">
        <ThemeToggle />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 border-comic bg-brand-white dark:bg-brand-black shadow-brutal-black hover-brutal active-brutal cursor-pointer focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-brand-white dark:bg-brand-black border-b-4 border-brand-black dark:border-brand-white flex flex-col p-6 gap-4 font-comic font-bold md:hidden shadow-brutal-lg z-50">
          <button 
            onClick={() => scrollToSection("tentang")} 
            className="w-full text-left py-3 px-4 border-comic hover:bg-brand-yellow dark:hover:text-brand-black transition-all"
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => scrollToSection("project")} 
            className="w-full text-left py-3 px-4 border-comic hover:bg-brand-blue hover:text-brand-white transition-all"
          >
            Gallery Project
          </button>
          <button 
            onClick={() => scrollToSection("faq")} 
            className="w-full text-left py-3 px-4 border-comic hover:bg-brand-red hover:text-brand-white transition-all"
          >
            Tanya Jawab
          </button>
          <button 
            onClick={() => scrollToSection("donasi-sekarang")} 
            className="w-full text-center py-4 border-comic bg-brand-red text-brand-white font-heading text-lg uppercase shadow-brutal-black flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-brand-white animate-pulse" />
            Donasi Sekarang
          </button>
        </div>
      )}
    </nav>
  );
}
