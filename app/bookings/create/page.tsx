// app/bookings/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBookingPage() {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, date, time }),
    });

    if (response.ok) {
      router.push("/bookings");
    } else {
      const data = await response.json();
      setError(data.error || "Failed to create booking");
    }
  };
  const handleBecomeOwner = async () => {
    try {
      const res = await fetch("/api/user/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole: "owner" }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Nie udało się zmienić roli");
        return;
      }
      // Można odświeżyć sesję lub użytkownika, aby nowe dane były dostępne
      router.push("/services/create-form"); // lub przekierowanie do formularza tworzenia usługi
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Create Booking</h1>
      <button onClick={handleBecomeOwner}>Kliknij aby zostać twórcą</button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Service ID"
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button type="submit">Create</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
