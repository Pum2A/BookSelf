// firms/create/page.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function CreateFirmPage() {
  const router = useRouter();

  const [newFirm, setNewFirm] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
  });
  const [error, setError] = useState<string | null>(null);

  // W rzeczywistości pobierz id właściciela z kontekstu autoryzacji lub sesji
  const loggedOwnerId = 1;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...newFirm,
      ownerId: loggedOwnerId,
    };

    const response = await fetch("/api/firms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const createdFirm = await response.json();
      alert("Firma została utworzona");
      // Przekierowanie do szczegółów utworzonej firmy lub listy
      router.push(`/firms/${createdFirm.id}`);
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Błąd tworzenia firmy");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Utwórz nową firmę</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Nazwa:
            <input
              type="text"
              value={newFirm.name}
              onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Opis:
            <textarea
              value={newFirm.description}
              onChange={(e) =>
                setNewFirm({ ...newFirm, description: e.target.value })
              }
              required
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Lokalizacja:
            <input
              type="text"
              value={newFirm.location}
              onChange={(e) =>
                setNewFirm({ ...newFirm, location: e.target.value })
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            Godziny otwarcia:
            <input
              type="text"
              value={newFirm.openingHours}
              onChange={(e) =>
                setNewFirm({ ...newFirm, openingHours: e.target.value })
              }
              required
            />
          </label>
        </div>
        <button type="submit">Utwórz firmę</button>
      </form>
    </div>
  );
}
