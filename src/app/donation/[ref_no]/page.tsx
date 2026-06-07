"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
const confetti = require("canvas-confetti");



interface PageProps {
  params: Promise<{ ref_no: string }>;
}

interface DonationStatus {
  ref_no: string;
  status: string;
  amount: number;
  customer_name: string;
  message: string;
  issuer: string | null;
  paidAt: string | null;
}

export default function DonationPage({ params }: PageProps) {
  const { ref_no } = use(params);
  
  const [data, setData] = useState<DonationStatus | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Timer state (30 menit = 1800 detik)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isExpired, setIsExpired] = useState(false);
  const hasCelebrated = useRef(false);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`/api/donations/status?ref_no=${ref_no}`);
      const result = await response.json();
      
      if (result.status === "error") {
        setError(result.message);
        return;
      }

      setData(result);
      
      if (!qrUrl && result.status === "pending") {
        // Gunakan API QR Code Generator dari string QRIS MustikaPayment atau mock string.
        // Jika dari MustikaPayment, data QRIS ada di qr_url/payment_link.
        // Di sini kita bisa generate QR code dari parameter ref_no / data transaksi.
        // QRIS dinamis merupakan format string panjang. Jika di mock mode, kita buat mock string QRIS.
        const mockQRISPayload = `00020101021226590014ID.CO.QRIS.WWW0215ID10202183391940303UMI511900129000000000000005204581253033605405100005802ID5915Ryezenn Project6009Tangerang61051511162070703A016304ECE3`;
        setQrUrl(
          `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mockQRISPayload)}`
        );
      }
      
      // Deteksi jika pembayaran berhasil
      if (result.status === "success" && !hasCelebrated.current) {
        hasCelebrated.current = true;
        triggerConfetti();
      }
    } catch (err) {
      console.error("Error fetching donation details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll status setiap 3 detik
  useEffect(() => {
    fetchDetails();
    
    let interval: NodeJS.Timeout;
    
    if (!isExpired && (!data || data.status === "pending")) {
      interval = setInterval(fetchDetails, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [ref_no, isExpired, data?.status]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    if (data && data.status !== "pending") return;

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, data?.status]);

  // Simulasi tombol Bayar Sukses Instan (Untuk mempermudah testing Mock Mode)
  const triggerMockSuccess = async () => {
    try {
      // Panggil status callback tiruan
      await fetch("/api/donations/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref_no: ref_no,
          status: "success",
          issuer: "MOCK_GOPAY",
        }),
      });
      // Panggil fetchDetails untuk update halaman
      fetchDetails();
    } catch (err) {
      console.error("Error triggering mock success:", err);
    }
  };

  const triggerConfetti = () => {
    // Ledakan Confetti Bouncy khas Komik
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Ledakan kiri
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      // Ledakan kanan
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white dark:bg-[#121214] flex flex-col items-center justify-center p-6 transition-colors">
        <div className="border-comic-thick p-6 bg-brand-yellow font-heading text-2xl shadow-brutal-lg flex items-center gap-3 animate-bounce">
          <Loader className="w-6 h-6 animate-spin" />
          MEMBUAT PEMBAYARAN... ⚡
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-brand-white dark:bg-[#121214] flex flex-col items-center justify-center p-6 transition-colors">
        <div className="border-comic-thick p-8 bg-brand-red text-brand-white shadow-brutal-lg max-w-md text-center transform -rotate-1">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <h1 className="font-heading text-2xl uppercase mb-3">ERROR DITEMUKAN!</h1>
          <p className="font-comic font-black text-sm mb-6">
            {error || "Pembayaran tidak dapat ditemukan atau gagal diproses."}
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-brand-white text-brand-black border-comic font-heading text-xs uppercase shadow-brutal-sm hover-brutal active-brutal inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const isPending = data.status === "pending";
  const isSuccess = data.status === "success";

  return (
    <div className="min-h-screen bg-brand-yellow/5 dark:bg-[#121214] flex flex-col items-center justify-center p-6 md:p-12 transition-colors">
      <div className="max-w-md w-full">
        
        {/* Back Link */}
        <Link
          href="/"
          className="font-heading text-xs uppercase text-brand-black dark:text-brand-white mb-6 inline-flex items-center gap-2 hover:underline focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {isSuccess ? (
          /* SUCCESS PAGE */
          <div className="border-comic-thick bg-brand-white dark:bg-[#1E1E1E] p-8 shadow-brutal-lg text-center transform rotate-1 relative transition-all duration-500">
            {/* Success badge banner */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-green text-brand-white font-heading text-sm px-4 py-1.5 uppercase tracking-widest border-comic shadow-brutal-sm">
              BERHASIL! 🎉
            </div>

            <CheckCircle className="w-20 h-20 text-brand-green mx-auto mb-6 mt-4 animate-bounce-slow" />
            
            <h1 className="font-heading text-3xl uppercase text-brand-black dark:text-brand-white leading-none mb-3">
              TERIMA KASIH, <br />
              <span className="text-brand-red dark:text-brand-yellow">{data.customer_name}</span>!
            </h1>

            <p className="font-comic font-black text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Dukungan sebesar <span className="font-heading text-base text-brand-black dark:text-brand-white">{formatIDR(data.amount)}</span> telah kami terima melalui <span className="bg-brand-blue text-brand-white border-comic-thin px-1.5 py-0.2 font-heading text-xs uppercase tracking-wider">{data.issuer}</span>.
            </p>

            {data.message && (
              <div className="border-comic p-4 bg-brand-yellow/10 dark:bg-brand-black/20 text-left mb-6 relative">
                <span className="font-comic font-black text-[10px] text-zinc-500 block mb-1">PESAN ANDA:</span>
                <p className="font-comic font-bold text-xs italic text-brand-black dark:text-brand-white leading-relaxed">
                  "{data.message}"
                </p>
              </div>
            )}

            <p className="font-comic font-black text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Setiap rupiah sangat berarti bagi perkembangan bot discord, telegram, dan tools open source Ryezenn Project. Kamu adalah pahlawan komunitas! 🦸‍♂️
            </p>

            <Link
              href="/"
              className="w-full py-4 bg-brand-yellow text-brand-black border-comic-thick font-heading text-lg uppercase shadow-brutal-black hover-brutal active-brutal cursor-pointer flex items-center justify-center gap-2"
            >
              KEMBALI KE BERANDA 🚀
            </Link>
          </div>
        ) : isExpired ? (
          /* EXPIRED PAGE */
          <div className="border-comic-thick bg-brand-white dark:bg-[#1E1E1E] p-8 shadow-brutal-lg text-center transform -rotate-1 relative">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-red text-brand-white font-heading text-sm px-4 py-1.5 border-comic shadow-brutal-sm">
              KADALUARSA ⚠️
            </div>

            <Clock className="w-16 h-16 text-brand-red mx-auto mb-6 mt-4" />

            <h1 className="font-heading text-2xl uppercase text-brand-black dark:text-brand-white mb-3">
              BARCODE KADALUARSA
            </h1>
            <p className="font-comic font-bold text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Waktu pembayaran Anda selama 30 menit telah habis. Silakan buat transaksi donasi baru pada halaman utama.
            </p>

            <Link
              href="/"
              className="w-full py-4 bg-brand-red text-brand-white border-comic-thick font-heading text-lg uppercase shadow-brutal-black hover-brutal active-brutal cursor-pointer flex items-center justify-center gap-2"
            >
              DONASI KEMBALI 💳
            </Link>
          </div>
        ) : (
          /* PENDING PAYMENT SCREEN (QRIS Code) */
          <div className="border-comic-thick bg-brand-white dark:bg-[#1E1E1E] p-6 md:p-8 shadow-brutal-lg text-center relative transition-all duration-500">
            {/* Header Badge */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-blue text-brand-white font-heading text-xs px-4 py-1.5 uppercase tracking-widest border-comic shadow-brutal-sm">
              PINDAI QRIS 📱
            </div>

            <div className="mt-4 mb-6">
              <span className="font-comic font-black text-xs text-zinc-400 dark:text-zinc-500 block uppercase">
                TOTAL BAYAR
              </span>
              <span className="font-heading text-2xl md:text-3xl text-brand-red dark:text-brand-yellow tracking-wide leading-none mt-1 inline-block">
                {formatIDR(data.amount)}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="mx-auto w-64 h-64 border-comic-thick bg-brand-white p-4 shadow-brutal-sm flex items-center justify-center relative">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="QRIS Barcode"
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              ) : (
                <Loader className="w-12 h-12 text-brand-blue animate-spin" />
              )}
            </div>

            {/* Timer countdown row */}
            <div className="flex items-center justify-center gap-2 mt-6 mb-4 text-brand-red font-heading text-base uppercase">
              <Clock className="w-5 h-5 animate-pulse" />
              <span>SISA WAKTU: {formatTime(timeLeft)}</span>
            </div>

            {/* Polling loading indicator */}
            <div className="flex items-center justify-center gap-2 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 pt-4 mt-2">
              <Loader className="w-4 h-4 text-brand-blue animate-spin" />
              <span className="font-comic font-black text-xs text-zinc-500 dark:text-zinc-400 animate-pulse">
                Menunggu pembayaran Anda terdeteksi...
              </span>
            </div>

            {/* Mock Mode: Fast success shortcut button */}
            {ref_no.startsWith("MOCK_") && (
              <div className="mt-6 border-t-4 border-brand-black dark:border-brand-white pt-6">
                <button
                  onClick={triggerMockSuccess}
                  className="w-full py-2.5 bg-brand-green text-brand-white border-comic font-heading text-xs uppercase tracking-wider shadow-brutal-sm hover-brutal active-brutal cursor-pointer flex items-center justify-center gap-2"
                >
                  💡 KLIK UNTUK SIMULASI SUKSES (Cepat)
                </button>
                <p className="font-comic font-bold text-[10px] text-zinc-400 dark:text-zinc-500 mt-2">
                  * Tombol ini hanya muncul di mode simulasi (Mock Mode) untuk mempermudah review.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
