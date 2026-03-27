"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative px-4 md:px-8 py-16 md:py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0d0a02 50%, #050505 100%)",
      }}
    >
      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 100%)",
        }}
      />

      {/* Decorative ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none opacity-10"
        style={{
          border: "1px solid rgba(201,168,76,0.3)",
          animation: "spin-slow 30s linear infinite",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-5"
        style={{
          border: "1px solid rgba(201,168,76,0.6)",
          animation: "spin-slow 20s linear infinite reverse",
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10" ref={ref}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">Ready?</span>
          <div className="gradient-line mx-auto" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-6xl md:text-8xl font-semibold tracking-tight leading-tight mb-6"
        >
          Book Your <span className="gold-text">Dream Car</span>
          <br />
          <span className="text-white/30">Today.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#E5E5E5] text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Experience the difference of a premium rental service. Instant
          booking, zero hassle, unforgettable drives.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Primary pulse-glow button */}
          <a
            href="#"
            className="group relative inline-flex items-center justify-center px-10 py-4 rounded-full text-sm font-semibold tracking-wide overflow-hidden animate-pulse-glow transition-transform duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)",
              backgroundSize: "200% 200%",
              color: "#0a0800",
            }}
          >
            <span className="relative z-10">Book Now — Instant Confirm</span>
            {/* Shine sweep */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                animation: "shimmer 1.5s ease infinite",
                backgroundSize: "200% 100%",
              }}
            />
          </a>

          <a
            href="#"
            className="px-10 py-4 rounded-full border text-white/70 text-sm font-medium tracking-wide hover:text-white hover:bg-white/5 transition-all duration-300"
            style={{ borderColor: "rgba(201,168,76,0.3)" }}
          >
            Explore Fleet
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14"
        >
          {[
            "✓ Free Cancellation",
            "✓ No Hidden Charges",
            "✓ Instant Confirmation",
          ].map((badge) => (
            <span key={badge} className="text-[#A3A3A3] text-sm tracking-wide font-light">
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
