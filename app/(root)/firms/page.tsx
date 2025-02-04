// firms/page.tsx
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
    <div style={{ padding: "2rem" }}>
      <h1>Firmy</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Link href="/firms/create" legacyBehavior>
        <a>Utwórz nową firmę</a>
      </Link>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {firms.map((firm) => (
          <li
            key={firm.id}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            <h2>{firm.name}</h2>
            <p>{firm.description}</p>
            <p>Lokalizacja: {firm.location}</p>
            <p>Godziny otwarcia: {firm.openingHours}</p>
            <Link href={`/firms/${firm.id}`}>
              <a>Szczegóły / Edycja</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
