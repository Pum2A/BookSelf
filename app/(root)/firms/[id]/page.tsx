"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  ownerId: number;
}

export default function FirmDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [firm, setFirm] = useState<Firm | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
    address: "",
  });
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
      .then((data) => {
        setFirm(data);
        setFormData({
          name: data.name,
          description: data.description,
          location: data.location,
          openingHours: data.openingHours,
          address: data.address,
        });
      })
      .catch((err) => setError(err.message));
  }, [id]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/firms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const updatedFirm = await response.json();
      setFirm(updatedFirm);
      alert("Firma została zaktualizowana");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Błąd aktualizacji firmy");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć firmę?")) return;
    const response = await fetch(`/api/firms/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Firma została usunięta");
      router.push("/firms");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Błąd usuwania firmy");
    }
  };

  if (error)
    return (
      <div className="max-w-xl mx-auto p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  if (!firm)
    return (
      <div className="max-w-xl mx-auto p-8">
        <p>Ładowanie...</p>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Szczegóły firmy: {firm.name}</h1>
      <div className="mb-6">
        <p className="mb-1">
          <strong>ID:</strong> {firm.id}
        </p>
        <p>
          <strong>Właściciel (ID):</strong> {firm.ownerId}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nazwa:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Opis:</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Lokalizacja:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Godziny otwarcia:</label>
          <input
            type="text"
            value={formData.openingHours}
            onChange={(e) =>
              setFormData({ ...formData, openingHours: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Adres:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Aktualizuj firmę
        </button>
      </form>
      <button
        onClick={handleDelete}
        className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
      >
        Usuń firmę
      </button>
    </div>
  );
}
