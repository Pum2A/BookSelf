"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AddMenuItemPage() {
  const router = useRouter();
  const { id } = useParams(); // id firmy przekazywane jako parametr URL

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      setError("Proszę uzupełnić wymagane pola.");
      return;
    }

    const response = await fetch("/api/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, firmId: id }),
    });

    if (response.ok) {
      alert("Usługa została dodana pomyślnie.");
      router.push(`/firms/${id}`);
    } else {
      const data = await response.json();
      setError(data.message || "Błąd podczas dodawania usługi");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-background shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-text">
          Dodaj usługę
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-text">
              Nazwa usługi
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Wpisz nazwę usługi"
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-text">Opis</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Opcjonalny opis usługi"
              rows={4}
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-accents"
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-text">Cena</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="Podaj cenę"
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
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
              placeholder="Wpisz kategorię"
              required
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text focus:outline-none focus:ring-2 focus:ring-accents"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accents hover:bg-accents-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Dodaj usługę
          </button>
        </form>
      </div>
    </div>
  );
}
