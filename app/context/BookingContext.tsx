"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CarData {
  id: number;
  name: string;
  image: string;
  price: string;
  fuel: string;
  seats: number;
  type: string;
  tag: string;
  priceNum?: number; // numeric price per day for calculations
}

interface BookingContextType {
  isOpen: boolean;
  selectedCar: CarData | null;
  openBooking: (car?: CarData) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);

  const openBooking = useCallback((car?: CarData) => {
    setSelectedCar(car ?? null);
    setIsOpen(true);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <BookingContext.Provider value={{ isOpen, selectedCar, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
