"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  address: string;
  menuItems: MenuItem[];
}

export default function ServicesPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const res = await fetch("/api/firms");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Błąd pobierania danych");
        setFirms(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchFirms();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Dostępne usługi</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {firms.map((firm) => (
        <div key={firm.id} className="mb-8 border p-6 rounded bg-white shadow">
          <h2 className="text-3xl font-semibold mb-4">{firm.name}</h2>
          <p className="mb-4 text-gray-700">{firm.description}</p>
          <h3 className="text-2xl font-bold mb-3">Usługi:</h3>
          <ul className="space-y-4">
            {firm.menuItems?.length > 0 ? (
              firm.menuItems.map((item) => (
                <li key={item.id} className="border rounded p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-semibold">
                      {item.name} - {item.price} zł
                    </p>
                    <Link
                      href={`/book-service?firmId=${firm.id}&menuItemId=${item.id}`}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Zarezerwuj
                    </Link>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-gray-500">Brak dostępnych usług.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
