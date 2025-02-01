// app/firms/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Firm {
  id: number;
  name: string;
}

export default function FirmsPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch("/api/firms");
        if (!response.ok) throw new Error("Failed to fetch firms");
        const data = await response.json();
        setFirms(data);
      } catch (error) {
        toast.error("Error loading firms");
      } finally {
        setLoading(false);
      }
    };
    fetchFirms();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Firms</h1>
        <button
          onClick={() => router.push("/firms/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Firm
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {firms.map((firm) => (
          <div
            key={firm.id}
            onClick={() => router.push(`/firms/${firm.id}`)}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <h2 className="text-xl font-medium">{firm.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
