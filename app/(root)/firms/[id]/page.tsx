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

  const handleDeleteMenuItem = async (itemId: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tę usługę?")) return;
    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Błąd usuwania usługi");

      // Odśwież dane firmy
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
        {/* ... istniejące pola formularza ... */}
      </form>

      <button
        onClick={handleDelete}
        className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
      >
        Usuń firmę
      </button>

      <section className="mt-12 border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Lista usług</h2>
          <button
            onClick={() => router.push(`/firms/${id}/add-menu-item`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Dodaj nową usługę
          </button>
        </div>

        <div className="space-y-4">
          {firm.menuItems?.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-2">
                    <span className="font-medium">{item.price} PLN</span>
                    <span className="ml-3 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/firms/${id}/edit-menu-item/${item.id}`)
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            </div>
          ))}

          {firm.menuItems?.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Brak dostępnych usług
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
