"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useBooking } from "../context/BookingContext";

const CARS = [
  {
    id: 1,
    name: "Maruti Swift Dzire",
    image: "/cars/dzire.png",
    price: "₹999",
    fuel: "Petrol",
    seats: 5,
    type: "Sedan",
    tag: "Most Popular",
  },
  {
    id: 2,
    name: "Hyundai Creta",
    image: "/cars/creta.png",
    price: "₹1,499",
    fuel: "Diesel",
    seats: 5,
    type: "SUV",
    tag: "Premium",
  },
  {
    id: 3,
    name: "Tata Nexon EV",
    image: "/cars/nexon.png",
    price: "₹1,299",
    fuel: "Electric",
    seats: 5,
    type: "SUV",
    tag: "Eco Drive",
  },
  {
    id: 4,
    name: "Honda City",
    image: "/cars/city.png",
    price: "₹1,199",
    fuel: "Petrol",
    seats: 5,
    type: "Sedan",
    tag: "Business",
  },
  {
    id: 5,
    name: "Mahindra Thar",
    image: "/cars/thar.png",
    price: "₹1,599",
    fuel: "Diesel",
    seats: 4,
    type: "Off-Road SUV",
    tag: "Adventure",
  },
  {
    id: 6,
    name: "Kia Seltos",
    image: "/cars/seltos.png",
    price: "₹1,399",
    fuel: "Petrol/Diesel",
    seats: 5,
    type: "SUV",
    tag: "Sporty",
  },
  {
    id: 7,
    name: "Toyota Innova Crysta",
    image: "/cars/innova.png",
    price: "₹1,899",
    fuel: "Diesel",
    seats: 7,
    type: "MPV",
    tag: "Family",
  },
  {
    id: 8,
    name: "MG Hector",
    image: "/cars/hector.png",
    price: "₹1,499",
    fuel: "Petrol/Diesel",
    seats: 5,
    type: "SUV",
    tag: "Luxury",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

export default function FeaturedCars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleCount, setVisibleCount] = useState(4);
  const { openBooking } = useBooking();

  return (
    <section id="fleet" className="relative bg-[#050505] px-4 md:px-8 py-10 md:py-16 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="section-label">Fleet</span>
          <div className="gradient-line mx-auto" />
          <h2 className="text-6xl md:text-7xl font-semibold text-white tracking-tight leading-tight">
            Featured <span className="gold-text">Vehicles</span>
          </h2>
          <p className="text-[#E5E5E5] mt-6 text-lg md:text-xl font-light max-w-xl mx-auto">
            Handpicked for comfort, style, and reliability. Every car is
            inspected and ready for your journey.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {CARS.slice(0, visibleCount).map((car, i) => (
              <motion.div
                key={car.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                exit={{ opacity: 0, y: 20 }}
                className="flip-card h-[480px] cursor-pointer group"
                tabIndex={0}
              >
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front glass flex flex-col transition-shadow duration-500 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  {/* Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[10px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.4)",
                        color: "#c9a84c",
                      }}
                    >
                      {car.tag}
                    </span>
                  </div>
                  {/* Car image */}
                  <div className="flex-1 flex items-center justify-center p-6 pt-12 overflow-hidden rounded-xl">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-56 object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.15] group-hover:drop-shadow-[0_0_15px_rgba(201,168,76,0.5)]"
                      style={{ filter: "brightness(0.92) contrast(1.05)" }}
                    />
                  </div>
                  {/* Name + type */}
                  <div className="px-6 pb-6">
                    <p className="text-[#A3A3A3] text-xs tracking-widest uppercase mb-1">
                      {car.type}
                    </p>
                    <h3 className="text-white/95 text-lg font-semibold tracking-tight">
                      {car.name}
                    </h3>
                    <p className="text-[#A3A3A3] text-xs mt-1 font-light">
                      Hover to see details →
                    </p>
                  </div>
                </div>

                {/* Back */}
                <div
                  className="flip-card-back flex flex-col justify-between p-6"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(20,15,5,0.98) 0%, rgba(10,8,2,0.98) 100%)",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-2 font-medium"
                       style={{ color: "#c9a84c" }}>
                      {car.type}
                    </p>
                    <h3 className="text-white/95 text-xl font-semibold tracking-tight mb-5">
                      {car.name}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: "Price / Day", value: car.price },
                        { label: "Fuel Type", value: car.fuel },
                        { label: "Seating", value: `${car.seats} Persons` },
                      ].map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between py-2 border-b border-white/5"
                        >
                          <span className="text-[#A3A3A3] text-xs tracking-wide">
                            {spec.label}
                          </span>
                          <span className="text-[#E5E5E5] text-sm font-medium">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-6 block w-full text-center py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                    style={{
                      background:
                        "linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)",
                      color: "#0a0800",
                    }}
                    onClick={(e) => { e.stopPropagation(); openBooking(car); }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* See More Button */}
        {visibleCount < CARS.length && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-14 flex justify-center"
          >
            <button
              onClick={() => setVisibleCount(CARS.length)}
              className="group relative px-8 py-4 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.1)] to-transparent group-hover:via-[rgba(201,168,76,0.2)]" />
              <div className="absolute inset-0 border border-[rgba(201,168,76,0.3)] rounded-full glow-border group-hover:border-[rgba(201,168,76,0.6)]" />
              <span className="relative text-sm font-semibold tracking-widest text-[#c9a84c] uppercase">
                See More Vehicles
              </span>
              <svg className="relative w-4 h-4 text-[#c9a84c] transform transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
