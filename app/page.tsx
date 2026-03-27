"use client";

import { BookingProvider, useBooking } from "./context/BookingContext";
import BookingModal from "./components/BookingModal";
import CarScrollAnimation from "./components/CarScrollAnimation";
import FeaturedCars from "./components/FeaturedCars";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorks from "./components/HowItWorks";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import PremiumFooter from "./components/PremiumFooter";

function Navbar() {
  const { openBooking } = useBooking();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 pointer-events-none">
      {/* Glass pill behind nav */}
      <div
        className="absolute inset-x-4 inset-y-2 rounded-2xl pointer-events-none"
        style={{
          background: "rgba(5,5,5,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Logo */}
      <div className="pointer-events-auto relative z-10">
        <span className="text-xl font-semibold tracking-tight">
          <span className="gold-text">Tech</span>
          <span className="text-white/40">taxi</span>
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6 pointer-events-auto relative z-10">
        {[
          { label: "Home", href: "#home" },
          { label: "Why Us", href: "#why-us" },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Contact", href: "#contact" }
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-[#E5E5E5] text-sm tracking-wide hover:text-white transition-colors duration-300 hidden md:block"
          >
            {label}
          </a>
        ))}
        <button
          onClick={() => openBooking()}
          className="px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(201,168,76,0.25)]"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))",
            border: "1px solid rgba(201,168,76,0.35)",
            color: "#c9a84c",
          }}
        >
          Book Now
        </button>
      </div>
    </nav>
  );
}

function PageContent() {
  return (
    <main id="home" className="bg-[#050505] min-h-screen">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero — Scroll Animation ───────────────────────────── */}
      <CarScrollAnimation />

      {/* ── Specs Strip ──────────────────────────────────────── */}
      <section className="bg-[#050505] px-4 md:px-8 py-10 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[#A3A3A3] text-xs tracking-[0.4em] uppercase mb-8 text-center">
            Fleet Highlights
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            {[
              { value: "50+", unit: "",    label: "Vehicles"      },
              { value: "4.9", unit: "★",   label: "Avg Rating"    },
              { value: "24/7",unit: "",    label: "Support"       },
              { value: "₹999",unit: "/day",label: "Starting From" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center py-10 px-4 bg-[#080808] hover:bg-[#0d0a02] transition-colors duration-500 group"
              >
                <span className="text-4xl md:text-5xl font-semibold tracking-tight"
                  style={{ color: "rgba(255,255,255,0.88)" }}>
                  {stat.value}
                  <span className="text-xl md:text-2xl ml-1" style={{ color: "#c9a84c" }}>
                    {stat.unit}
                  </span>
                </span>
                <span className="text-[#A3A3A3] text-xs tracking-widest uppercase mt-3 font-light">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Cars ─────────────────────────────────────── */}
      <FeaturedCars />

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <WhyChooseUs />

      {/* ── How It Works ──────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Testimonials ──────────────────────────────────────── */}
      <Testimonials />

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CTASection />

      {/* ── Footer ────────────────────────────────────────────── */}
      <PremiumFooter />

      {/* ── Booking Modal (portal-like, outside scroll context) ── */}
      <BookingModal />
    </main>
  );
}

export default function Home() {
  return (
    <BookingProvider>
      <PageContent />
    </BookingProvider>
  );
}
