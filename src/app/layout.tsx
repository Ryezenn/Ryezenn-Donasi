import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ryezenn Project | Dukung Komunitas Developer & Open Source 🚀",
  description: "Bantu pengembangan bot Discord/Telegram, website tools, AI tools, dan project open source Ryezenn Project yang bermanfaat bagi komunitas.",
  keywords: ["Ryezenn Project", "Donasi QRIS", "Bot Discord", "Bot Telegram", "Open Source Developer", "MustikaPayment", "Confetti Donation"],
  authors: [{ name: "Ryezenn Team" }],
  openGraph: {
    title: "Ryezenn Project | Dukung Komunitas Developer & Open Source 🚀",
    description: "Bantu pengembangan bot Discord/Telegram, website tools, AI tools, dan project open source Ryezenn Project yang bermanfaat bagi komunitas.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryezenn Project | Dukung Komunitas Developer",
    description: "Bantu pengembangan bot, website, dan tools open source.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=Lilita+One&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-black">
        {children}
      </body>
    </html>
  );
}
