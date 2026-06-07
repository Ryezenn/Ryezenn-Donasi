"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Cek apakah class dark aktif saat inisialisasi
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 border-comic rounded-none bg-brand-yellow dark:bg-brand-blue text-brand-black dark:text-brand-white shadow-brutal-black hover-brutal active-brutal transition-all cursor-pointer font-bold focus:outline-none flex items-center justify-center gap-2"
      aria-label="Toggle Theme Mode"
      id="theme-toggle"
    >
      {darkMode ? (
        <>
          <Sun className="w-5 h-5 animate-spin-slow" />
          <span className="font-heading text-xs uppercase tracking-wider hidden sm:inline">SIANG</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 animate-bounce-slow" />
          <span className="font-heading text-xs uppercase tracking-wider hidden sm:inline">MALAM</span>
        </>
      )}
    </button>
  );
}
