"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { z } from "zod";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";

const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Nieprawidłowy format daty",
  }),
  selectedSlot: z.string().min(1, {
    message: "Wybierz godzinę rezerwacji",
  }),
  numberOfPeople: z.number().max(1, {
    message: "Liczba osób to max 1",
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
    const today = new Date().toISOString().split("T")[0];

    if (newDate < today) {
      toast.error("Nie można wybrać przeszłej daty.");
      return;
    }

    setDate(newDate);
    fetchAvailableSlots(newDate);
  };

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
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-indigo-950 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-8 bg-white/80 dark:bg-gray-800/50 rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 shadow-2xl backdrop-blur-sm"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Book Your Service
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Reservation Date</span>
              </div>
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="w-full px-4 py-4 rounded-xl bg-white/60 dark:bg-gray-800/30 border-2 border-indigo-100/80 dark:border-indigo-900/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Available Slots</span>
              </div>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400 border-t-transparent"></div>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="col-span-full flex items-center justify-center gap-3 text-center text-gray-500 dark:text-gray-400 py-6 bg-white/60 dark:bg-gray-800/30 rounded-xl border border-indigo-100/80 dark:border-indigo-900/30">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span>No available slots for this date</span>
                </div>
              ) : (
                availableSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 rounded-lg text-center transition-all shadow ${
                      selectedSlot === slot
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                        : "bg-white/60 dark:bg-gray-800/30 text-gray-600 dark:text-gray-300 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20"
                    }`}
                  >
                    {slot}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Number of People</span>
              </div>
            </label>
            <input
              type="number"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(Number(e.target.value))}
              max="1"
              min="1"
              disabled
              className="w-full px-4 py-4 rounded-xl bg-white/60 dark:bg-gray-800/30 border-2 border-indigo-100/80 dark:border-indigo-900/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting || !selectedSlot}
            className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirm Booking</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
