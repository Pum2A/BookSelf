// components/BookingForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  firmId: number;
}

export default function BookingForm({ firmId }: BookingFormProps) {
  const router = useRouter();
  const [bookingTime, setBookingTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/bookings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingTime, numberOfPeople, firmId }),
    });

    if (response.ok) {
      alert("Rezerwacja utworzona!");
      router.push("/bookings"); // Przykładowa strona z listą rezerwacji
    } else {
      const data = await response.json();
      setError(data.message || "Błąd podczas tworzenia rezerwacji");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded mt-4">
      <h2 className="text-xl font-semibold mb-2">Zarezerwuj stolik</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block mb-1">Data i godzina rezerwacji</label>
        <input
          type="datetime-local"
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div>
        <label className="block mb-1">Liczba osób</label>
        <input
          type="number"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(Number(e.target.value))}
          min="1"
          required
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
      >
        Zarezerwuj
      </button>
    </form>
  );
}
