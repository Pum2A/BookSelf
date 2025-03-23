"use client";

import React, { useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AddMenuItemPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "0",
    category: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      setError("Wypełnij wszystkie wymagane pola");
      return;
    }

    const priceValue = parseFloat(formData.price);

    if (priceValue > 1000) {
      setError("Cena nie może być większa niż 1000.");
      return;
    }

    if (priceValue < 0) {
      setError("Cena nie może być ujemna.");
      return;
    }

    if (priceValue === 0) {
      setError("Cena nie może być równa 0.");
      return;
    }

    try {
      const newMenuItem = {
        name: formData.name,
        description: formData.description,
        price: priceValue,
        category: formData.category,
        firmId: Number(id),
      };

      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenuItem),
      });

      if (!response.ok) throw new Error("Błąd dodawania usługi");

      router.push(`/firms/${id}`);
    } catch (err) {
      setError("Nie udało się dodać usługi");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dodaj nową usługę</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-background p-6 rounded-lg shadow"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div>
          <label className="block mb-2 font-semibold">Nazwa usługi *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Opis</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg h-32"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Cena (PLN) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1000"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Kategoria *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Dodaj usługę
        </button>
      </form>
    </div>
  );
}
