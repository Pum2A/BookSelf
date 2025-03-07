"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const result = firmSchema.safeParse({ ...newFirm, [field]: value });
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
      setNewFirm((prev) => ({ ...prev, [field]: value }));
      validateField(field, value);
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = firmSchema.safeParse(newFirm);

    if (!result.success) {
      const newErrors = result.error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      return;
    }

    if (!user) {
      toast.error(
        DOMPurify.sanitize("Musisz być zalogowany, aby dodać firmę.")
      );
      return;
    }

    try {
      const response = await fetch("/api/firms", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newFirm, ownerId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd tworzenia firmy");
      }

      const createdFirm = await response.json();
      toast.success("Firma została utworzona pomyślnie!");
      router.push(`/firms/${createdFirm.firm.id}`);
    } catch (error: any) {
      toast.error(DOMPurify.sanitize(error.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-background shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-text">
          Utwórz nową firmę
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-text font-semibold mb-2">Nazwa:</label>
            <input
              type="text"
              value={newFirm.name}
              onChange={handleChange("name")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
              maxLength={50}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-2">Opis:</label>
            <textarea
              value={newFirm.description}
              onChange={handleChange("description")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
              maxLength={500}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-2">
              Lokalizacja:
            </label>
            <input
              type="text"
              value={newFirm.location}
              onChange={handleChange("location")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-2">
              Godziny otwarcia (HH:MM-HH:MM):
            </label>
            <input
              type="text"
              value={newFirm.openingHours}
              onChange={handleChange("openingHours")}
              placeholder="np. 08:00-16:00"
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
            {errors.openingHours && (
              <p className="text-red-400 text-sm mt-1">{errors.openingHours}</p>
            )}
          </div>

          <div>
            <label className="block text-text font-semibold mb-2">Adres:</label>
            <input
              type="text"
              value={newFirm.address}
              onChange={handleChange("address")}
              className="w-full border border-border rounded-lg px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">{errors.address}</p>
            )}
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
