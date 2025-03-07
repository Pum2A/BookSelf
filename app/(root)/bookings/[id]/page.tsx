"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface BookingDetails {
  id: number;
  bookingTime: string;
  numberOfPeople: number;
  status: "confirmed" | "pending" | "cancelled";
  firm: { name: string } | null;
  menuItem: { name: string } | null;
}

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = params.id; // Upewnij się, że w route masz [id]
  const router = useRouter();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Błąd pobierania danych");
        }
        const data = await res.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-accents" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Brak szczegółów rezerwacji.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto bg-sections p-6 rounded shadow">
        <h1 className="text-3xl font-bold text-text mb-4">
          Szczegóły rezerwacji
        </h1>
        <p className="text-secondText mb-2">
          <strong>ID:</strong> {booking.id}
        </p>
        <p className="text-secondText mb-2">
          <strong>Data rezerwacji:</strong>{" "}
          {new Date(booking.bookingTime).toLocaleString()}
        </p>
        <p className="text-secondText mb-2">
          <strong>Liczba osób:</strong> {booking.numberOfPeople}
        </p>
        <p className="text-secondText mb-2">
          <strong>Status:</strong> {booking.status}
        </p>
        <p className="text-secondText mb-2">
          <strong>Nazwa firmy:</strong>{" "}
          {booking.firm ? booking.firm.name : "Brak danych"}
        </p>
        <p className="text-secondText mb-4">
          <strong>Usługa:</strong>{" "}
          {booking.menuItem ? booking.menuItem.name : "Brak danych"}
        </p>
        <Button onClick={() => router.back()} className="mt-4">
          Powrót
        </Button>
      </div>
    </div>
  );
}
