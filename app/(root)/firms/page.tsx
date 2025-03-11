"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRightIcon, Loader, Loader2 } from "lucide-react";

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  ownerId: number;
}

export default function FirmsListPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch("/api/firms");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Dodaj walidację odpowiedzi
        if (!Array.isArray(result.data)) {
          throw new Error("Nieprawidłowy format danych");
        }

        setFirms(result.data);
      } catch (err) {
        console.error("Błąd pobierania firm:", err);
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchFirms();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin w-10 h-10 text-accents" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded-lg max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-2">Błąd ładowania</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent"
      >
        Manage Firms
      </motion.h1>

      {error && <p className="text-red-400 text-center mb-8">{error}</p>}

      <div className="flex justify-center mb-12">
        <Link
          href="/firms/create"
          className="bg-accents hover:bg-accents-dark text-text py-3 px-8 rounded-xl transition-colors shadow-lg flex items-center gap-2"
        >
          <span>+</span> Create New Firm
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {firms.map((firm) => (
          <motion.div
            key={firm.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-sections rounded-2xl border border-border/50 p-8 hover:border-accents/30 transition-all"
          >
            <h2 className="text-2xl font-bold mb-4 text-text">{firm.name}</h2>
            <p className="text-secondText mb-6">{firm.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-secondText">
                <span className="font-medium">Location:</span>
                {firm.location}
              </div>
              <div className="flex items-center gap-2 text-secondText">
                <span className="font-medium">Hours:</span>
                {firm.openingHours}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href={`/firms/${firm.id}`}
                className="text-accents hover:text-accents-dark font-medium flex items-center gap-2"
              >
                Edit Details <ChevronRightIcon size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
