"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "Business Traveller",
    initials: "AS",
    stars: 5,
    text: "Absolutely premium experience. The car was immaculate, pickup was smooth and the 24/7 support team was incredibly helpful when I needed to extend my rental.",
    color: "#c9a84c",
  },
  {
    name: "Priya Nair",
    role: "Leisure Traveller",
    initials: "PN",
    stars: 5,
    text: "Booked within 2 minutes and the car was at my doorstep. Techtaxi has completely changed how I think about car rentals. Never going back to traditional services.",
    color: "#81b4d9",
  },
  {
    name: "Rohit Verma",
    role: "Road Trip Enthusiast",
    initials: "RV",
    stars: 5,
    text: "The Creta I rented was in showroom condition. GPS pre-loaded with my destination, fuel topped up. Little details that show they genuinely care.",
    color: "#a8d5a2",
  },
  {
    name: "Sneha Kapoor",
    role: "Corporate Client",
    initials: "SK",
    stars: 5,
    text: "We use Techtaxi for all our executive travel needs. Consistent quality, professional drivers, always punctual. Our clients are always impressed.",
    color: "#d9a8c9",
  },
  {
    name: "Vikram Patel",
    role: "Weekend Explorer",
    initials: "VP",
    stars: 5,
    text: "Pricing is transparent, the app is slick, and the cars are top notch. Rented the EV for a mountain trip — handled every hairpin beautifully.",
    color: "#d9c8a8",
  },
  {
    name: "Ananya Gupta",
    role: "Family Traveller",
    initials: "AG",
    stars: 5,
    text: "Traveling with kids is stressful, but Techtaxi made everything effortless. The car seat was already installed and the vehicle was spotlessly clean.",
    color: "#c9a84c",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="#c9a84c" className="w-4 h-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Duplicate for seamless loop
  const allCards = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="relative bg-[#050505] py-16 md:py-20 overflow-hidden">
      {/* Top / bottom fade masks */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10"
          style={{
            background: "linear-gradient(90deg, #050505, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10"
          style={{
            background: "linear-gradient(-90deg, #050505, transparent)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="section-label">Testimonials</span>
          <div className="gradient-line mx-auto" />
          <h2 className="text-5xl md:text-6xl font-semibold text-white tracking-tight leading-tight">
            What Our <span className="gold-text">Clients Say</span>
          </h2>
          <p className="text-white/65 mt-4 text-base font-light max-w-lg mx-auto">
            Thousands of happy customers across India trust Techtaxi.
          </p>
        </motion.div>
      </div>

      {/* Scrolling marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="overflow-hidden"
      >
        <div
          className="flex gap-6 animate-scroll-x"
          style={{ width: "max-content" }}
        >
          {allCards.map((t, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-7 w-[360px] shrink-0 hover:border-[rgba(201,168,76,0.2)] transition-all duration-500"
            >
              <StarRating count={t.stars} />
              <p className="text-white/70 text-sm leading-relaxed font-light mb-6 line-clamp-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`,
                    border: `1px solid ${t.color}44`,
                    color: t.color,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
