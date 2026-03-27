"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking, CarData } from "../context/BookingContext";

const ALL_CARS: CarData[] = [
  { id: 1, name: "Maruti Swift Dzire", image: "/cars/dzire.png",   price: "₹999",   priceNum: 999,  fuel: "Petrol",       seats: 5, type: "Sedan",       tag: "Most Popular" },
  { id: 2, name: "Hyundai Creta",      image: "/cars/creta.png",   price: "₹1,499", priceNum: 1499, fuel: "Diesel",       seats: 5, type: "SUV",         tag: "Premium"      },
  { id: 3, name: "Tata Nexon EV",      image: "/cars/nexon.png",   price: "₹1,299", priceNum: 1299, fuel: "Electric",     seats: 5, type: "SUV",         tag: "Eco Drive"    },
  { id: 4, name: "Honda City",         image: "/cars/city.png",    price: "₹1,199", priceNum: 1199, fuel: "Petrol",       seats: 5, type: "Sedan",       tag: "Business"     },
  { id: 5, name: "Mahindra Thar",      image: "/cars/thar.png",    price: "₹1,599", priceNum: 1599, fuel: "Diesel",       seats: 4, type: "Off-Road SUV", tag: "Adventure"    },
  { id: 6, name: "Kia Seltos",         image: "/cars/seltos.png",  price: "₹1,399", priceNum: 1399, fuel: "Petrol/Diesel",seats: 5, type: "SUV",         tag: "Sporty"       },
  { id: 7, name: "Toyota Innova",      image: "/cars/innova.png",  price: "₹1,899", priceNum: 1899, fuel: "Diesel",       seats: 7, type: "MPV",         tag: "Family"       },
  { id: 8, name: "MG Hector",          image: "/cars/hector.png",  price: "₹1,499", priceNum: 1499, fuel: "Petrol/Diesel",seats: 5, type: "SUV",         tag: "Luxury"       },
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  pickup: string;
  drop: string;
  pickupDate: string;
  returnDate: string;
  isRoundTrip: boolean;
  passengers: string;
  luggage: string;
}

const INITIAL_FORM: FormState = {
  name: "", phone: "", email: "",
  pickup: "", drop: "",
  pickupDate: "", returnDate: "",
  isRoundTrip: false,
  passengers: "1", luggage: "none",
};

const inputClass = `
  w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/85
  placeholder-white/25 outline-none transition-all duration-300
  focus:border-[rgba(201,168,76,0.5)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.08)]
`.trim();

const inputErrorClass = `
  w-full bg-white/[0.04] border border-red-400/40 rounded-xl px-4 py-3 text-sm text-white/85
  placeholder-white/25 outline-none transition-all duration-300
  focus:border-red-400/60 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.08)]
`.trim();

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "#c9a84c" }}>
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2))" }} />
      <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-light">{children}</p>
      <div className="h-px flex-1" style={{ background: "linear-gradient(270deg, transparent, rgba(201,168,76,0.2))" }} />
    </div>
  );
}

export default function BookingModal() {
  const { isOpen, selectedCar, closeBooking } = useBooking();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [chosenCar, setChosenCar] = useState<CarData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [estimate, setEstimate] = useState<string | null>(null);

  // Sync chosen car when modal opens from a card
  useEffect(() => {
    if (isOpen) {
      setChosenCar(selectedCar);
      setForm(INITIAL_FORM);
      setErrors({});
      setEstimate(null);
      setIsSuccess(false);
    }
  }, [isOpen, selectedCar]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeBooking(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeBooking]);

  const set = (key: keyof FormState, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const calcDays = useCallback(() => {
    if (!form.pickupDate || !form.returnDate) return null;
    const ms = new Date(form.returnDate).getTime() - new Date(form.pickupDate).getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
    return days > 0 ? days : null;
  }, [form.pickupDate, form.returnDate]);

  const getEstimate = () => {
    const days = form.isRoundTrip ? calcDays() : null;
    if (!chosenCar) { setEstimate("Please select a vehicle first."); return; }
    if (form.isRoundTrip && !days) { setEstimate("Please set valid pickup & return dates."); return; }
    const total = form.isRoundTrip && days
      ? (chosenCar.priceNum! * days).toLocaleString("en-IN")
      : chosenCar.priceNum!.toLocaleString("en-IN");
    setEstimate(
      form.isRoundTrip && days
        ? `Estimated Total: ₹${total} (${days} day${days > 1 ? "s" : ""} × ${chosenCar.price}/day)`
        : `Price: ${chosenCar.price}/day`
    );
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = true;
    if (!form.pickup.trim()) e.pickup = true;
    if (!form.drop.trim()) e.drop = true;
    if (!form.pickupDate) e.pickupDate = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => { closeBooking(); setIsSuccess(false); }, 2800);
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.25, delay: 0.1 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
    exit: { opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as [number, number, number, number] } },
  };

  const fieldStagger = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: 0.1 + i * 0.055, duration: 0.38, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="booking-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(5,5,5,0.82)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeBooking(); }}
        >
          <motion.div
            key="booking-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(18,14,4,0.98) 0%, rgba(8,6,1,0.99) 100%)",
              border: "1px solid rgba(201,168,76,0.2)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,168,76,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* ─── Header ─── */}
            <div className="flex-none flex items-center justify-between px-6 pt-6 pb-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <motion.span custom={0} variants={fieldStagger} initial="hidden" animate="visible"
                  className="block text-[10px] tracking-[0.4em] uppercase font-medium mb-1" style={{ color: "#c9a84c" }}>
                  Techtaxi Booking
                </motion.span>
                <motion.h2 custom={1} variants={fieldStagger} initial="hidden" animate="visible"
                  className="text-xl font-semibold text-white/90 tracking-tight">
                  Reserve Your Ride
                </motion.h2>
              </div>
              <button
                onClick={closeBooking}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white/8 text-white/30 hover:text-white/70"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ─── Success State ─── */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-8 text-center"
                  style={{ background: "linear-gradient(145deg, rgba(18,14,4,0.99), rgba(8,6,1,0.99))" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))",
                      border: "1px solid rgba(201,168,76,0.4)",
                      boxShadow: "0 0 40px rgba(201,168,76,0.3)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#c9a84c" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h3 className="text-2xl font-semibold text-white/90 mb-2">Booking Confirmed!</h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      We&apos;ve received your request. Our team will call you shortly to confirm your ride details.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── Scrollable Body ─── */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7 scroll-smooth"
              style={{ scrollbarWidth: "none" }}>

              {/* User Details */}
              <div>
                <SectionHeading>Your Details</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div custom={2} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Full Name *</Label>
                    <input
                      className={errors.name ? inputErrorClass : inputClass}
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={(e) => { set("name", e.target.value); setErrors((er) => ({ ...er, name: false })); }}
                    />
                    {errors.name && <p className="text-red-400/70 text-[10px] mt-1 ml-1">Name is required</p>}
                  </motion.div>
                  <motion.div custom={3} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Phone Number *</Label>
                    <input
                      className={errors.phone ? inputErrorClass : inputClass}
                      placeholder="98765 43210"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => { set("phone", e.target.value); setErrors((er) => ({ ...er, phone: false })); }}
                    />
                    {errors.phone && <p className="text-red-400/70 text-[10px] mt-1 ml-1">Valid 10-digit number required</p>}
                  </motion.div>
                  <motion.div custom={4} variants={fieldStagger} initial="hidden" animate="visible" className="sm:col-span-2">
                    <Label>Email (Optional)</Label>
                    <input
                      className={inputClass}
                      placeholder="rahul@email.com"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <SectionHeading>Trip Details</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div custom={5} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Pickup Location *</Label>
                    <input
                      className={errors.pickup ? inputErrorClass : inputClass}
                      placeholder="Mumbai Airport, T2"
                      value={form.pickup}
                      onChange={(e) => { set("pickup", e.target.value); setErrors((er) => ({ ...er, pickup: false })); }}
                    />
                    {errors.pickup && <p className="text-red-400/70 text-[10px] mt-1 ml-1">Pickup location required</p>}
                  </motion.div>
                  <motion.div custom={6} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Drop Location *</Label>
                    <input
                      className={errors.drop ? inputErrorClass : inputClass}
                      placeholder="Bandra Kurla Complex"
                      value={form.drop}
                      onChange={(e) => { set("drop", e.target.value); setErrors((er) => ({ ...er, drop: false })); }}
                    />
                    {errors.drop && <p className="text-red-400/70 text-[10px] mt-1 ml-1">Drop location required</p>}
                  </motion.div>
                  <motion.div custom={7} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Pickup Date & Time *</Label>
                    <input
                      type="datetime-local"
                      className={errors.pickupDate ? inputErrorClass : inputClass}
                      value={form.pickupDate}
                      onChange={(e) => { set("pickupDate", e.target.value); setErrors((er) => ({ ...er, pickupDate: false })); }}
                      style={{ colorScheme: "dark" }}
                    />
                    {errors.pickupDate && <p className="text-red-400/70 text-[10px] mt-1 ml-1">Pickup date required</p>}
                  </motion.div>
                  <motion.div custom={8} variants={fieldStagger} initial="hidden" animate="visible">
                    <div className="flex items-center justify-between mb-2">
                      <Label>Return Date & Time</Label>
                      <button
                        type="button"
                        onClick={() => set("isRoundTrip", !form.isRoundTrip)}
                        className={`text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full transition-all duration-300 font-semibold ${
                          form.isRoundTrip
                            ? "text-[#0a0800]"
                            : "text-white/30 border border-white/10"
                        }`}
                        style={form.isRoundTrip ? {
                          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                        } : {}}
                      >
                        {form.isRoundTrip ? "Round Trip ✓" : "One Way"}
                      </button>
                    </div>
                    <input
                      type="datetime-local"
                      className={inputClass}
                      disabled={!form.isRoundTrip}
                      value={form.returnDate}
                      onChange={(e) => set("returnDate", e.target.value)}
                      style={{ colorScheme: "dark", opacity: form.isRoundTrip ? 1 : 0.35 }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Ride Info */}
              <div>
                <SectionHeading>Ride Info</SectionHeading>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div custom={9} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Passengers</Label>
                    <select
                      className={inputClass}
                      value={form.passengers}
                      onChange={(e) => set("passengers", e.target.value)}
                      style={{ colorScheme: "dark" }}
                    >
                      {[1,2,3,4,5,6,7].map((n) => (
                        <option key={n} value={n} style={{ background: "#0e0b02" }}>{n} {n === 1 ? "Person" : "Persons"}</option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div custom={10} variants={fieldStagger} initial="hidden" animate="visible">
                    <Label>Luggage</Label>
                    <select
                      className={inputClass}
                      value={form.luggage}
                      onChange={(e) => set("luggage", e.target.value)}
                      style={{ colorScheme: "dark" }}
                    >
                      {[
                        { val: "none", label: "No Luggage" },
                        { val: "cabin", label: "Cabin Bags (1–2)" },
                        { val: "check", label: "Check-in (1–2)" },
                        { val: "heavy", label: "Heavy Luggage" },
                      ].map((o) => (
                        <option key={o.val} value={o.val} style={{ background: "#0e0b02" }}>{o.label}</option>
                      ))}
                    </select>
                  </motion.div>
                </div>
              </div>

              {/* Car Selection */}
              <div>
                <SectionHeading>Select Your Vehicle</SectionHeading>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                  {ALL_CARS.map((car, i) => {
                    const isSelected = chosenCar?.id === car.id;
                    return (
                      <motion.button
                        key={car.id}
                        type="button"
                        custom={11 + i}
                        variants={fieldStagger}
                        initial="hidden"
                        animate="visible"
                        onClick={() => { setChosenCar(car); setEstimate(null); }}
                        className={`flex-none w-32 rounded-2xl p-3 text-left transition-all duration-300 ${
                          isSelected ? "scale-[1.03]" : "hover:scale-[1.02]"
                        }`}
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.05))"
                            : "rgba(255,255,255,0.03)",
                          border: isSelected
                            ? "1px solid rgba(201,168,76,0.55)"
                            : "1px solid rgba(255,255,255,0.07)",
                          boxShadow: isSelected ? "0 0 20px rgba(201,168,76,0.15)" : "none",
                        }}
                      >
                        <div className="w-full h-16 rounded-xl overflow-hidden mb-2">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="w-full h-full object-cover"
                            style={{ filter: "brightness(0.9) contrast(1.05)" }}
                          />
                        </div>
                        <p className="text-[10px] text-white/35 uppercase tracking-widest mb-0.5">{car.type}</p>
                        <p className="text-white/85 text-xs font-semibold leading-tight mb-1">{car.name}</p>
                        <p className="text-[11px] font-bold" style={{ color: "#c9a84c" }}>{car.price}<span className="text-white/25 font-normal text-[9px]">/day</span></p>
                        {isSelected && (
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#c9a84c" }} />
                            <p className="text-[9px] tracking-widest uppercase font-semibold" style={{ color: "#c9a84c" }}>Selected</p>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Estimate Result */}
              <AnimatePresence>
                {estimate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl px-5 py-4 text-sm font-medium"
                    style={{
                      background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.04))",
                      border: "1px solid rgba(201,168,76,0.25)",
                      color: "#e8d090",
                    }}
                  >
                    💰 {estimate}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Footer / CTAs ─── */}
            <div className="flex-none px-6 pb-6 pt-4 flex gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                type="button"
                onClick={getEstimate}
                className="flex-1 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.3)",
                  color: "#c9a84c",
                }}
              >
                Get Estimate
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-[2] py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
                style={{
                  background: isLoading
                    ? "rgba(201,168,76,0.5)"
                    : "linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)",
                  backgroundSize: "200% 100%",
                  color: "#0a0800",
                  boxShadow: isLoading ? "none" : "0 4px 20px rgba(201,168,76,0.3)",
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                    </svg>
                    Processing…
                  </>
                ) : "Book Now →"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
