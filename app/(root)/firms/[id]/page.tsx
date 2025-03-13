"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const firmSchema = z.object({
  name: z
    .string()
    .min(3, "Nazwa musi mieć minimum 3 znaki")
    .max(50, "Nazwa może mieć maksymalnie 50 znaków")
    .regex(/^[a-zA-Z0-9\sąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/, "Niedozwolone znaki w nazwie"),
  description: z
    .string()
    .min(10, "Opis musi mieć minimum 10 znaków")
    .max(500, "Opis może mieć maksymalnie 500 znaków"),
  location: z
    .string()
    .min(3, "Lokalizacja musi mieć minimum 3 znaki")
    .regex(
      /^[a-zA-Z\sąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]+$/,
      "Nieprawidłowy format lokalizacji"
    ),
  openingHours: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Format HH:MM-HH:MM"
    ),
  address: z.string().min(5, "Adres musi mieć minimum 5 znaków"),
});

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error("Nieprawidłowe ID firmy");
      return;
    }

    fetch(`/api/firms/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Błąd pobierania firmy");
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
      .catch(() => toast.error("Błąd pobierania firmy"));
  }, [id]);

  const validateField = (field: string, value: string) => {
    const result = firmSchema.safeParse({ ...formData, [field]: value });
    if (!result.success) {
      const fieldError = result.error.errors.find((e) =>
        e.path.includes(field)
      )?.message;
      setErrors((prev) => ({ ...prev, [field]: fieldError || "" }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      validateField(field, value);
    };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = firmSchema.safeParse(formData);
    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/firms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd aktualizacji firmy");
      }

      const updatedFirm = await response.json();
      setFirm(updatedFirm);
      toast.success("Firma została zaktualizowana");
    } catch (error: any) {
      toast.error(error.message || "Błąd aktualizacji firmy");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Czy na pewno chcesz usunąć firmę?")) return;
    try {
      const response = await fetch(`/api/firms/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Błąd usuwania firmy");

      toast.success("Firma została usunięta");
      router.push("/firms");
    } catch (error: any) {
      toast.error(error.message || "Nie udało się usunąć firmy");
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
      toast.success("Usługa została usunięta");
    } catch (error: any) {
      toast.error(error.message || "Nie udało się usunąć usługi");
    }
  };

  if (!firm) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p className="text-center text-text">Ładowanie...</p>
      </div>
    );
  }

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
              onChange={handleChange("name")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
              maxLength={50}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">Opis:</label>
            <textarea
              value={formData.description}
              onChange={handleChange("description")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents h-32"
              maxLength={500}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">
              Lokalizacja:
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={handleChange("location")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">
              Godziny otwarcia (HH:MM-HH:MM):
            </label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={handleChange("openingHours")}
              placeholder="np. 08:00-16:00"
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
            {errors.openingHours && (
              <p className="text-red-400 text-sm mt-1">{errors.openingHours}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-1">Adres:</label>
            <input
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-gray-600" : "bg-accents hover:bg-accents-dark"
            } text-white py-2 rounded-lg transition-colors`}
          >
            {isSubmitting ? "Aktualizowanie..." : "Zaktualizuj firmę"}
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
