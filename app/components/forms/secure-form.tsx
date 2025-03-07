"use client";

import React, { useState, FormEvent } from "react";
import { toast } from "react-toastify";
import DOMPurify from "dompurify"; // do sanityzacji treści toastów, jeśli pobierasz dane użytkownika

export default function SecureForm() {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Jeśli masz token CSRF zapisany w ciasteczku, możesz go odczytać
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrfToken="))
        ?.split("=")[1];

      const response = await fetch("/api/secure-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Przekaż token CSRF, jeśli biblioteka oczekuje go w nagłówku:
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas przesyłania formularza");
      }

      // Sanityzacja komunikatu przed wyświetleniem – zapobiega wstrzyknięciom
      const safeMessage = DOMPurify.sanitize(
        "Formularz został pomyślnie wysłany"
      );
      toast.success(safeMessage);
    } catch (error) {
      toast.error("Błąd wysyłania formularza");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nazwa"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full border rounded px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
        required
      />
      <textarea
        placeholder="Opis"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="w-full border rounded px-4 py-2 bg-secondary text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accents"
        required
      ></textarea>
      <button
        type="submit"
        className="w-full bg-accents hover:bg-accents-dark text-white py-2 rounded transition-colors"
      >
        Wyślij formularz
      </button>
    </form>
  );
}
