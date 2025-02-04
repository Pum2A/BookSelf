"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // import router
import { useParams } from "next/navigation"; // import useParams from next/navigation

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
  const { id } = params; // Now you can safely access `id`

  const [firm, setFirm] = useState<Firm | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    openingHours: "",
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

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!firm) return <p>Ładowanie...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Szczegóły firmy: {firm.name}</h1>
      <p>
        <strong>ID:</strong> {firm.id}
      </p>
      <p>
        <strong>Właściciel (ID):</strong> {firm.ownerId}
      </p>
      <form onSubmit={handleUpdate} style={{ marginTop: "1rem" }}>
        <div>
          <label>
            Nazwa:
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            Opis:
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            ></textarea>
          </label>
        </div>
        <div>
          <label>
            Lokalizacja:
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </label>
        </div>
        <div>
          <label>
            Godziny otwarcia:
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) =>
                setFormData({ ...formData, openingHours: e.target.value })
              }
              required
            />
          </label>
        </div>
        <button type="submit">Aktualizuj firmę</button>
      </form>
      <button
        onClick={handleDelete}
        style={{ marginTop: "1rem", color: "red" }}
      >
        Usuń firmę
      </button>
    </div>
  );
}
