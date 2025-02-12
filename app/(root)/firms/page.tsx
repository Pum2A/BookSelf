"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/userStore";

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
}

export default function FirmsListPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  useEffect(() => {
    fetch("/api/firms")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Błąd pobierania danych");
        return data;
      })
      .then((data) => setFirms(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Firmy</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {firms.length === 0 && !error && (
        <p className="text-gray-500 text-center">Brak dostępnych firm</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {firms.map((firm) => (
          <div
            key={firm.id}
            className="bg-white rounded shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-3">{firm.name}</h2>
            <p className="text-gray-700 mb-2">{firm.description}</p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Lokalizacja:</span>{" "}
              {firm.location}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Godziny otwarcia:</span>{" "}
              {firm.openingHours}
            </p>
            {user && user.role === "OWNER" ? (
              <Link
                href={`/firms/${firm.id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Edytuj
              </Link>
            ) : (
              <Link
                href={`/firms/${firm.id}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Zobacz i zarezerwuj
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
