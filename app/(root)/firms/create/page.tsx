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
    address: "",
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newFirm, ownerId: user.id }),
    });

    if (response.ok) {
      const createdFirm = await response.json();
      alert("Firma została utworzona");
      router.push(`/firms/${createdFirm.firm.id}`);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      setError(errorData.message || "Błąd tworzenia firmy");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-background shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-text">
          Utwórz nową firmę
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-text font-semibold mb-2">Nazwa:</label>
            <input
              type="text"
              value={newFirm.name}
              onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })}
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
          <div>
            <label className="block text-text font-semibold mb-2">Opis:</label>
            <textarea
              value={newFirm.description}
              onChange={(e) =>
                setNewFirm({ ...newFirm, description: e.target.value })
              }
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            ></textarea>
          </div>
          <div>
            <label className="block text-text font-semibold mb-2">
              Lokalizacja:
            </label>
            <input
              type="text"
              value={newFirm.location}
              onChange={(e) =>
                setNewFirm({ ...newFirm, location: e.target.value })
              }
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
          <div>
            <label className="block text-text font-semibold mb-2">
              Godziny otwarcia:
            </label>
            <input
              type="text"
              value={newFirm.openingHours}
              onChange={(e) =>
                setNewFirm({ ...newFirm, openingHours: e.target.value })
              }
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
          <div>
            <label className="block text-text font-semibold mb-2">Adres:</label>
            <input
              type="text"
              value={newFirm.address}
              onChange={(e) =>
                setNewFirm({ ...newFirm, address: e.target.value })
              }
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accents hover:bg-accents-dark text-white py-3 rounded-lg transition-colors"
          >
            Utwórz firmę
          </button>
        </form>
      </div>
    </div>
  );
}
