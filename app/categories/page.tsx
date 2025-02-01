"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error("Error loading categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => router.push(`/categories/${category.id}`)}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
          >
            <h2 className="text-lg font-medium">{category.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
