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
      // Upewnij się, że adres zwracanego obiektu jest poprawny
      router.push(`/firms/${createdFirm.firm.id}`);
    } else {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      setError(errorData.message || "Błąd tworzenia firmy");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Utwórz nową firmę</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nazwa:</label>
          <input
            type="text"
            value={newFirm.name}
            onChange={(e) => setNewFirm({ ...newFirm, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Opis:</label>
          <textarea
            value={newFirm.description}
            onChange={(e) =>
              setNewFirm({ ...newFirm, description: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Lokalizacja:</label>
          <input
            type="text"
            value={newFirm.location}
            onChange={(e) =>
              setNewFirm({ ...newFirm, location: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Godziny otwarcia:</label>
          <input
            type="text"
            value={newFirm.openingHours}
            onChange={(e) =>
              setNewFirm({ ...newFirm, openingHours: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Adres:</label>
          <input
            type="text"
            value={newFirm.address}
            onChange={(e) =>
              setNewFirm({ ...newFirm, address: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Utwórz firmę
        </button>
      </form>
    </div>
  );
}
