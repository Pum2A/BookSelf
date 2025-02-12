"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Interfejsy – możesz je modyfikować w zależności od struktury danych
interface Booking {
  id: number;
  bookingTime: string;
  numberOfPeople: number;
  status: string; // np. "PENDING", "CONFIRMED", "CANCELLED"
  firm: {
    id: number;
    name: string;
    // inne dane firmy jeśli potrzebne
  };
  menuItem?: {
    id: number;
    name: string;
    // opcjonalnie: cena, opis itp.
  };
}

export default function BookingsListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Funkcja pobierająca rezerwacje zalogowanego klienta
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Błąd pobierania rezerwacji");
      }
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Funkcja do anulowania rezerwacji z dodatkowym potwierdzeniem
  const handleCancel = async (bookingId: number) => {
    const confirmCancel = window.confirm(
      "Czy na pewno chcesz anulować tę rezerwację?"
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Błąd anulowania rezerwacji");
      }
      alert("Rezerwacja została anulowana.");
      fetchBookings(); // odświeżenie listy rezerwacji
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Pomocnicza funkcja formatująca datę i godzinę
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Moje rezerwacje</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">
          Nie masz żadnych rezerwacji.
        </p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded p-6 bg-white shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">
                  {booking.firm.name}
                  {booking.menuItem && ` - ${booking.menuItem.name}`}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-200 text-green-800"
                      : booking.status === "PENDING"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="mb-2">
                <span className="font-semibold">Data i godzina:</span>{" "}
                {formatDateTime(booking.bookingTime)}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Liczba osób:</span>{" "}
                {booking.numberOfPeople}
              </p>
              {/* Możesz dodać dodatkowe informacje, np. opis usługi */}
              <button
                onClick={() => handleCancel(booking.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Anuluj rezerwację
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
