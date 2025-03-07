"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMenuItemPage() {
  const router = useRouter();
  const { id, itemId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/menu-items/${itemId}`);
        if (!response.ok) throw new Error("Błąd pobierania danych");

        const data = await response.json();
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          category: data.category,
        });
      } catch (err) {
        setError("Nie udało się załadować usługi");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
        }),
      });

      if (!response.ok) throw new Error("Błąd aktualizacji");

      router.push(`/firms/${id}`);
    } catch (err) {
      setError("Nie udało się zaktualizować usługi");
    }
  };

  if (loading)
    return <div className="text-center p-8 text-text">Ładowanie...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-background shadow rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-text">
        Edytuj usługę
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pole nazwa */}
        <div>
          <label className="block mb-2 font-semibold text-text">
            Nazwa usługi
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
          />
        </div>

        {/* Pole opis */}
        <div>
          <label className="block mb-2 font-semibold text-text">Opis</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-border rounded-lg px-4 py-2 h-32 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
          />
        </div>

        {/* Pole cena */}
        <div>
          <label className="block mb-2 font-semibold text-text">
            Cena (PLN)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
          />
        </div>

        {/* Pole kategoria */}
        <div>
          <label className="block mb-2 font-semibold text-text">
            Kategoria
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
            className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-accents hover:bg-accents-dark text-white py-3 rounded-lg transition"
        >
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}
