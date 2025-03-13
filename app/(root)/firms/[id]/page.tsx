"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

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
  ownerId: number;
  address: string;
  menuItems: MenuItem[];
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
      headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`/api/firms/${id}`, { method: "DELETE" });
    if (response.ok) {
      alert("Firma została usunięta");
      router.push("/firms");
    } else {
      const errorData = await response.json();
      setError(errorData.message || "Błąd usuwania firmy");
    }
  };

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tę usługę?")) return;
    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Błąd usuwania usługi");
      const updatedFirm = await fetch(`/api/firms/${id}`).then((res) =>
        res.json()
      );
      setFirm(updatedFirm);
    } catch (err) {
      setError("Nie udało się usunąć usługi");
    }
  };

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  if (!firm)
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-center text-text">Ładowanie...</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-background shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-text">
          Szczegóły firmy: {firm.name}
        </h1>
        <div className="mb-4">
          <p className="mb-1 text-text">
            <strong>ID:</strong> {firm.id}
          </p>
          <p className="text-text">
            <strong>Właściciel (ID):</strong> {firm.ownerId}
          </p>
        </div>
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-text font-semibold mb-1">Nazwa:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">Opis:</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents h-32"
            />
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">
              Lokalizacja:
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">
              Godziny otwarcia:
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) =>
                setFormData({ ...formData, openingHours: e.target.value })
              }
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
              placeholder="np. 9:00 - 17:00"
            />
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">Adres:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accents hover:bg-accents-dark text-white py-2 rounded-lg transition-colors"
          >
            Zaktualizuj firmę
          </button>
        </form>
        <button
          onClick={handleDelete}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
        >
          Usuń firmę
        </button>
      </div>

      <section className="bg-background shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-text">Lista usług</h2>
          <button
            onClick={() => router.push(`/firms/${id}/add-menu-item`)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Dodaj nową usługę
          </button>
        </div>
        <div className="space-y-4">
          {firm.menuItems?.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg p-4 flex justify-between items-center bg-secondary"
            >
              <div>
                <h3 className="font-semibold text-lg text-text">{item.name}</h3>
                <p className="text-sm text-text/80">{item.description}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-medium text-text">
                    {item.price} PLN
                  </span>
                  <span className="text-sm bg-accents/10 text-accents px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/firms/${id}/edit-menu-item/${item.id}`)
                  }
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDeleteMenuItem(item.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
          {firm.menuItems?.length === 0 && (
            <p className="text-center text-text/70 py-4">
              Brak dostępnych usług
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
