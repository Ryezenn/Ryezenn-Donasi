"use client";

import { useState } from "react";
import { Heart, Loader } from "lucide-react";
import { useRouter as useNextRouter } from "next/navigation";


export default function DonateForm() {
  const router = useNextRouter();
  const [amount, setAmount] = useState<number | "">("");
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nominals = [10000, 25000, 50000, 100000];

  const handleNominalSelect = (val: number) => {
    setSelectedNominal(val);
    setAmount(val);
    setError(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    const parsed = rawVal ? parseInt(rawVal, 10) : "";
    setAmount(parsed);
    setSelectedNominal(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = Number(amount);
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 1000) {
      setError("Jumlah donasi minimal adalah Rp 1.000");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/donations/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalAmount,
          customer_name: name || "Anonim",
          message: message,
        }),
      });

      const result = await response.json();

      if (result.status === "success" && result.ref_no) {
        // Redirect ke halaman QRIS
        router.push(`/donation/${result.ref_no}`);
      } else {
        setError(result.message || "Gagal membuat barcode QRIS. Silakan coba kembali.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section id="donasi-sekarang" className="w-full py-16 md:py-24 px-6 md:px-12 border-b-4 border-brand-black dark:border-brand-white bg-brand-yellow/10 dark:bg-brand-black/20 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="bg-brand-red text-brand-white border-comic px-4 py-1.5 font-heading text-sm uppercase tracking-widest inline-block mb-4 shadow-brutal-black">
            Dukung Komunitas ☕
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl uppercase leading-none mt-2 text-brand-black dark:text-brand-white">
            KIRIMKAN DUKUNGANMU SEKARANG
          </h2>
          <p className="font-comic font-bold text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mt-4 text-xs md:text-sm">
            Donasi dinamis menggunakan QRIS. Bisa di-scan menggunakan GoPay, OVO, DANA, ShopeePay, LinkAja, atau aplikasi m-Banking Anda.
          </p>
        </div>

        {/* Form Container - Comic Panel look */}
        <div className="border-comic-thick bg-brand-white dark:bg-[#1E1E1E] p-6 md:p-10 shadow-brutal-lg relative transform rotate-0.5">
          {/* Header Panel */}
          <div className="absolute -top-5 left-6 bg-brand-black text-brand-white dark:bg-brand-white dark:text-brand-black font-heading text-xs px-4 py-1 uppercase tracking-widest border-comic-thin">
            FORMULIR DONASI 💳
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
            
            {/* Nominal Predefined Grid */}
            <div className="flex flex-col gap-2">
              <label className="font-comic font-black text-sm uppercase text-brand-black dark:text-brand-white">
                Pilih Nominal Donasi
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {nominals.map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => handleNominalSelect(nom)}
                    className={`p-3 border-comic font-heading text-base tracking-wide transition-all cursor-pointer ${
                      selectedNominal === nom
                        ? "bg-brand-yellow text-brand-black shadow-brutal-sm translate-x-[2px] translate-y-[2px]"
                        : "bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white shadow-brutal-black hover-brutal"
                    }`}
                  >
                    {formatIDR(nom)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="flex flex-col gap-2">
              <label className="font-comic font-black text-sm uppercase text-brand-black dark:text-brand-white">
                Atau Masukkan Nominal Custom (Min. Rp 1.000)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading text-lg text-brand-black dark:text-brand-white pointer-events-none">
                  Rp
                </span>
                <input
                  type="text"
                  value={amount === "" ? "" : amount.toLocaleString("id-ID")}
                  onChange={handleCustomAmountChange}
                  placeholder="Masukkan nominal lainnya..."
                  className="w-full pl-12 pr-4 py-4 border-comic bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white font-heading text-lg shadow-brutal-black rounded-none focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 focus:translate-x-[-1px] focus:translate-y-[-1px] transition-all"
                />
              </div>
            </div>

            {/* Donor Name & Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="font-comic font-black text-sm uppercase text-brand-black dark:text-brand-white">
                  Nama Anda / Samaran (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pahlawan Tanpa Tanda Jasa"
                  maxLength={50}
                  className="w-full px-4 py-3 border-comic bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white font-comic font-bold text-sm shadow-brutal-black rounded-none focus:outline-none focus:ring-4 focus:ring-brand-blue/50 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-comic font-black text-sm uppercase text-brand-black dark:text-brand-white">
                  Pesan Dukungan (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pesan penyemangat atau request fitur di sini..."
                  rows={2}
                  maxLength={200}
                  className="w-full px-4 py-3 border-comic bg-brand-white dark:bg-brand-black text-brand-black dark:text-brand-white font-comic font-bold text-sm shadow-brutal-black rounded-none focus:outline-none focus:ring-4 focus:ring-brand-blue/50 transition-all resize-none"
                />
              </div>

            </div>

            {/* Error Message */}
            {error && (
              <div className="border-comic bg-brand-red text-brand-white font-comic font-bold p-3 text-sm shadow-brutal-sm transform -rotate-0.5">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 border-comic-thick text-brand-white font-heading text-xl tracking-wider uppercase flex items-center justify-center gap-3 transition-all ${
                loading
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-brand-red hover-brutal active-brutal cursor-pointer shadow-brutal-black"
              }`}
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  MENGHUBUNGI GATEWAY... ⚡
                </>
              ) : (
                <>
                  <Heart className="w-6 h-6 fill-brand-white animate-pulse" />
                  BAYAR DENGAN QRIS SEKARANG!
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
