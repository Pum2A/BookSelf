"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function EditMenuItemPage() {
  const router = useRouter();
  const { id, itemId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        if (!itemId) {
          setError("Brak ID usługi");
          return;
        }
        const response = await fetch(`/api/menu-items/${itemId}`);
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych usługi");
        }
        const data = await response.json();
        setFormData({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          category: data.category,
        });
      } catch (err) {
        setError("Błąd podczas ładowania usługi");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItem();
  }, [itemId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = getCookie("token");
      if (!token) throw new Error("Brak autoryzacji");
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error("Wypełnij wszystkie wymagane pola");
      }
      const numericPrice = Number(formData.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("Nieprawidłowa cena");
      }
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, price: numericPrice }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd aktualizacji");
      }
      router.push(`/firms/${id}`);
    } catch (err: any) {
      setError(err.message || "Nie udało się zaktualizować usługi");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <Button className="mt-4" onClick={() => router.push(`/firms/${id}`)}>
            Powrót do firmy
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-text">
          Edytuj usługę
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Nazwa usługi"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="Opis"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Cena (PLN)"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
            <Input
              placeholder="Kategoria"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push(`/firms/${id}`)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                "Zapisz zmiany"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
