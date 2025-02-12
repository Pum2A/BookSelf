"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function BookServicePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firmId = searchParams.get("firmId");
  const menuItemId = searchParams.get("menuItemId");

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [date, setDate] = useState(""); // Możesz umożliwić wybór daty
  const [error, setError] = useState<string | null>(null);

  // Funkcja pobierająca dostępne sloty dla wybranej daty
  const fetchAvailableSlots = async (selectedDate: string) => {
    if (!firmId || !selectedDate) return;
    const res = await fetch(
      `/api/bookings/available?firmId=${firmId}&date=${selectedDate}`,
      { credentials: "include" }
    );
    if (res.ok) {
      const data = await res.json();
      setAvailableSlots(data.availableSlots);
    } else {
      const data = await res.json();
      setError(data.message || "Błąd pobierania dostępnych slotów");
    }
  };

  // Ustaw domyślną datę (np. dzisiejsza) i pobierz sloty
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
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

    // Łączymy datę z wybraną godziną
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
    <div className="max-w-xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Rezerwacja usługi</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Data rezerwacji</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Godzina rezerwacji</label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Wybierz godzinę</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Liczba osób</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(Number(e.target.value))}
            min="1"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors"
        >
          Zarezerwuj
        </button>
      </form>
    </div>
  );
}
