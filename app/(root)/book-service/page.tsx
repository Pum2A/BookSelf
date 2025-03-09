"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { z } from "zod";
import { toast } from "sonner";

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Nieprawidłowy format daty",
  }),
  selectedSlot: z.string().min(1, {
    message: "Wybierz godzinę rezerwacji",
  }),
  numberOfPeople: z.number().min(1, {
    message: "Liczba osób musi wynosić co najmniej 1",
  }),
  firmId: z.string().min(1, {
    message: "Wymagane ID firmy",
  }),
  menuItemId: z.string().min(1, {
    message: "Wymagane ID usługi",
  }),
});

export default function BookServicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firmId = searchParams.get("firmId");
  const menuItemId = searchParams.get("menuItemId");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [date, setDate] = useState("");

  const fetchAvailableSlots = async (selectedDate: string) => {
    if (!firmId || !selectedDate) return;
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/bookings/available?firmId=${firmId}&date=${selectedDate}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Błąd pobierania slotów");
      const data = await res.json();
      setAvailableSlots(data.availableSlots);
    } catch (error: any) {
      toast.error(DOMPurify.sanitize(error.message));
    } finally {
      setIsLoading(false);
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

  const Loader = () => (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-accents border-t-transparent"></div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationResult = bookingSchema.safeParse({
      date,
      selectedSlot,
      numberOfPeople,
      firmId: firmId || "",
      menuItemId: menuItemId || "",
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((err) => err.message)
        .join(". ");
      toast.error(DOMPurify.sanitize(errorMessage));
      return;
    }

    try {
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

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Błąd tworzenia rezerwacji");
      }

      toast.success("Rezerwacja utworzona pomyślnie!");
      router.push("/bookings");
    } catch (error: any) {
      toast.error(DOMPurify.sanitize(error.message));
    } finally {
      setIsSubmitting(false);
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
            {isLoading ? (
              <Loader />
            ) : availableSlots.length === 0 ? (
              <div className="col-span-full text-center text-secondText py-4">
                Brak dostępnych terminów
              </div>
            ) : (
              availableSlots.map((slot) => (
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
              ))
            )}
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
