"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import BookingForm from "@/app/components/forms/booking-form";

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  address: string;
  ownerId: number;
}

export default function FirmDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUserStore();

  const [firm, setFirm] = useState<Firm | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Nie znaleziono ID firmy");
      return;
    }
    fetch(`/api/firms/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Firma nie znaleziona");
        return res.json();
      })
      .then((data) => setFirm(data))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error)
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );

  if (!firm)
    return (
      <div className="max-w-2xl mx-auto p-8">
        <p className="text-center">Ładowanie...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Szczegóły firmy: {firm.name}
      </h1>
      <div className="mb-6 space-y-2">
        <p>
          <span className="font-semibold">Opis:</span> {firm.description}
        </p>
        <p>
          <span className="font-semibold">Lokalizacja:</span> {firm.location}
        </p>
        <p>
          <span className="font-semibold">Godziny otwarcia:</span>{" "}
          {firm.openingHours}
        </p>
        <p>
          <span className="font-semibold">Adres:</span> {firm.address}
        </p>
      </div>

      {user && user.role === "OWNER" && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => router.push(`/firms/${firm.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Edytuj firmę
          </button>
          <button
            onClick={async () => {
              if (confirm("Czy na pewno chcesz usunąć firmę?")) {
                const response = await fetch(`/api/firms/${firm.id}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  alert("Firma została usunięta");
                  router.push("/firms");
                } else {
                  const data = await response.json();
                  setError(data.message || "Błąd usuwania firmy");
                }
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Usuń firmę
          </button>
        </div>
      )}

      {user && user.role === "CUSTOMER" && (
        <div className="mt-6">
          <BookingForm firmId={firm.id} />
        </div>
      )}
    </div>
  );
}
