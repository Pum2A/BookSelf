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

  if (loading) return <div className="text-center p-8">Ładowanie...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Edytuj usługę</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pole nazwa */}
        <div>
          <label className="block mb-2 font-semibold">Nazwa usługi</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        {/* Pole opis */}
        <div>
          <label className="block mb-2 font-semibold">Opis</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2 h-32"
          />
        </div>

        {/* Pole cena */}
        <div>
          <label className="block mb-2 font-semibold">Cena (PLN)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        {/* Pole kategoria */}
        <div>
          <label className="block mb-2 font-semibold">Kategoria</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
}
