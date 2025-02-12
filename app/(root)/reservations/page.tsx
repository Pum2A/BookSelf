"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import Link from "next/link";

interface Booking {
  id: number;
  bookingTime: string;
  numberOfPeople: number;
  status: string;
  firmName: string;
  menuItemName?: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showBookings, setShowBookings] = useState(true); // Domyślnie pokazujemy rezerwacje

  useEffect(() => {
    if (!user) {
      setError("Musisz być zalogowany, aby zobaczyć rezerwacje.");
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Nie udało się pobrać rezerwacji.");
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancel = async (id: number) => {
    if (!confirm("Czy na pewno chcesz anulować tę rezerwację?")) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Nie udało się anulować rezerwacji.");

      alert("Rezerwacja została anulowana.");
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Rezerwacje</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setShowBookings(true)}
          className={`py-2 px-4 rounded ${
            showBookings ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Moje rezerwacje
        </button>
        <button
          onClick={() => setShowBookings(false)}
          className={`py-2 px-4 rounded ${
            !showBookings ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Zarezerwuj usługę
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {showBookings ? (
        bookings.length ? (
          <ul className="space-y-6">
            {bookings.map((booking) => (
              <li key={booking.id} className="border p-4 rounded bg-gray-50">
                <p className="text-lg font-semibold">{booking.firmName}</p>
                {booking.menuItemName && (
                  <p className="text-sm text-gray-600">
                    Usługa: {booking.menuItemName}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Data i godzina:</span>{" "}
                  {new Date(booking.bookingTime).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Liczba osób:</span>{" "}
                  {booking.numberOfPeople}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {booking.status}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => router.push(`/bookings/${booking.id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Anuluj
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">Brak rezerwacji.</p>
        )
      ) : (
        <div className="text-center">
          <p className="mb-4 text-gray-700">
            Kliknij poniżej, aby zarezerwować usługę.
          </p>
          <Link
            href="/bookings"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Zarezerwuj
          </Link>
        </div>
      )}
    </div>
  );
}
