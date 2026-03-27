"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Select Your Car",
    desc: "Browse our premium fleet and choose the vehicle that fits your journey perfectly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Choose Your Date",
    desc: "Pick your pickup and return dates. Flexible scheduling with instant availability check.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Confirm Booking",
    desc: "Secure checkout in seconds. Get instant confirmation and your car delivered to you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="relative px-4 md:px-8 py-10 md:py-16 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #050505 0%, #0a0800 50%, #050505 100%)",
      }}
    >
      {/* Ambient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="section-label">Process</span>
          <div className="gradient-line mx-auto" />
          <h2 className="text-6xl md:text-7xl font-semibold text-white tracking-tight leading-tight">
            How It <span className="gold-text">Works</span>
          </h2>
          <p className="text-[#E5E5E5] mt-6 text-lg max-w-xl mx-auto font-light">
            Three effortless steps between you and the open road.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col items-center gap-6">
          {/* Desktop card row with connectors */}
          <div className="hidden md:flex items-center justify-center w-full max-w-[1080px] gap-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center gap-3 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: i * 0.18 }}
                  className="group relative glass rounded-2xl p-10 text-center w-full max-w-[280px] hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-2 transition-all duration-500"
                >
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                      color: "#0a0800",
                      boxShadow: "0 0 20px rgba(201,168,76,0.4)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 mt-3"
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "#c9a84c",
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-white/95 text-lg font-semibold tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#E5E5E5] text-sm leading-relaxed font-light">
                    {step.desc}
                  </p>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.2, ease: "easeOut" }}
                    className="hidden md:block flex-1"
                    style={{ transformOrigin: "left center" }}
                  >
                    <div className="step-line" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile stacked steps */}
          <div className="md:hidden flex flex-col items-center w-full gap-4 max-w-[480px]">
            {STEPS.map((step, i) => (
              <div key={step.num} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.65, delay: i * 0.18 }}
                  className="group relative glass rounded-2xl p-7 text-center w-full hover:border-[rgba(201,168,76,0.3)] hover:-translate-y-1 transition-all duration-500"
                >
                  <div
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                      color: "#0a0800",
                      boxShadow: "0 0 20px rgba(201,168,76,0.4)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 mt-3"
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "1px solid rgba(201,168,76,0.2)",
                      color: "#c9a84c",
                    }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-white/95 text-lg font-semibold tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#E5E5E5] text-sm leading-relaxed font-light">
                    {step.desc}
                  </p>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div className="text-2xl text-[rgba(201,168,76,0.5)] text-center mt-2">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
