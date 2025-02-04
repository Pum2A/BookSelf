"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

export default function CreateFirmPage() {
  const router = useRouter();
  const { user } = useUserStore();

  const [newFirm, setNewFirm] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
    address: "", // Dodajemy pole address
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Musisz być zalogowany, aby dodać firmę.");
      return;
    }

    const response = await fetch("/api/firms", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ ...newFirm, ownerId: user.id }), // Teraz ownerId jest przekazywane
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const createdFirm = await response.json();
      alert("Firma została utworzona");
      router.push(`/firms/${createdFirm.id}`);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
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
        <div>
          <label>
            Adres:
            <input
              type="text"
              value={newFirm.address}
              onChange={(e) =>
                setNewFirm({ ...newFirm, address: e.target.value })
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
