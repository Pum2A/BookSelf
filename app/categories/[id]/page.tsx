"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  firm: { id: number; name: string };
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${id}`);
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        toast.error("Error loading category");
      }
    };
    fetchCategory();
  }, [id]);

  if (!category) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
      <p className="text-lg">Belongs to firm: {category.firm.name}</p>
    </div>
  );
}
