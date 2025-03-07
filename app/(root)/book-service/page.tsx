"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BookServicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firmId = searchParams.get("firmId");
  const menuItemId = searchParams.get("menuItemId");

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableSlots = async (selectedDate: string) => {
    if (!firmId || !selectedDate) return;
    const res = await fetch(
      `/api/bookings/available?firmId=${firmId}&date=${selectedDate}`,
      {
        credentials: "include",
      }
    );
    if (res.ok) {
      const data = await res.json();
      setAvailableSlots(data.availableSlots);
    } else {
      const data = await res.json();
      setError(data.message || "Błąd pobierania dostępnych slotów");
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    fetchAvailableSlots(today);
  }, [firmId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchAvailableSlots(newDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setError("Wybierz godzinę rezerwacji");
      return;
    }
    const bookingDateTime = new Date(`${date}T${selectedSlot}`);
    const response = await fetch("/api/bookings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingTime: bookingDateTime,
        numberOfPeople,
        firmId,
        menuItemId,
      }),
    });
    if (response.ok) {
      alert("Rezerwacja utworzona!");
      router.push("/bookings");
    } else {
      const data = await response.json();
      setError(data.message || "Błąd podczas tworzenia rezerwacji");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8 bg-sections rounded-2xl border border-border/50 shadow-2xl"
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
        Book Your Service
      </h1>
      {error && <p className="text-red-400 text-center mb-6">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-medium mb-3 text-text">
            Reservation Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-accents focus:ring-2 focus:ring-accents/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium mb-3 text-text">
            Available Slots
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedSlot === slot
                    ? "bg-accents text-text"
                    : "bg-background text-secondText hover:bg-sections/50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-lg font-medium mb-3 text-text">
            Number of People
          </label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            min="1"
            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-accents focus:ring-2 focus:ring-accents/30"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accents hover:bg-accents-dark text-text font-bold py-4 px-8 rounded-xl transition-colors shadow-lg"
        >
          Confirm Booking
        </button>
      </form>
    </motion.div>
  );
}
