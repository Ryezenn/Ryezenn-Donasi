import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import DonateForm from "@/components/DonateForm";
import RecentDonations from "@/components/RecentDonations";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Banner Section */}
        <Hero />

        {/* Stats and Leaderboard Section */}
        <Stats />

        {/* About Project Pillars Section */}
        <About />

        {/* Interactive Donation Section */}
        <DonateForm />

        {/* Real-time Ticker Feed */}
        <RecentDonations />

        {/* Screenshot Projects Section */}
        <Gallery />

        {/* FAQ Accordion Section */}
        <Faq />
      </main>

      {/* Footer Branding Section */}
      <Footer />
    </div>
  );
}
