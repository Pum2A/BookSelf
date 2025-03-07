"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/firms")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          // Rzucamy błędem z komunikatem z serwera
          throw new Error(data.message || "Błąd pobierania danych");
        }
        return data;
      })
      .then((data) => setFirms(data))
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

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
