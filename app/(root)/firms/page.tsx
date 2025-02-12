"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  ownerId: number;
}

export default function FirmsListPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/firms")
      .then((res) => res.json())
      .then((data) => setFirms(data))
      .catch((err) => {
        console.error(err);
        setError("Błąd pobierania firm");
      });
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Firmy</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex justify-center mb-8">
        <Link
          href="/firms/create"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Utwórz nową firmę
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {firms.map((firm) => (
          <div
            key={firm.id}
            className="bg-white rounded shadow p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{firm.name}</h2>
            <p className="text-gray-700 mb-2">{firm.description}</p>
            <p className="text-gray-600 mb-1">
              <strong>Lokalizacja:</strong> {firm.location}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Godziny otwarcia:</strong> {firm.openingHours}
            </p>
            <Link
              href={`/firms/${firm.id}`}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Edycja
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
