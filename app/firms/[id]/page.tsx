// app/firms/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Firm {
  id: number;
  name: string;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}

export default function FirmDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [firm, setFirm] = useState<Firm | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const fetchFirm = async () => {
      try {
        const response = await fetch(`/api/firms/${id}`);
        if (!response.ok) throw new Error("Failed to fetch firm");
        const data = await response.json();
        setFirm(data);
      } catch (error) {
        toast.error("Error loading firm");
      }
    };
    fetchFirm();
  }, [id]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName,
          firmId: id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const newCategory = await response.json();
      setFirm((prev) =>
        prev
          ? {
              ...prev,
              categories: [...prev.categories, newCategory.category],
            }
          : null
      );

      setNewCategoryName("");
      toast.success("Category added!");
    } catch (error) {
      toast.error("Error adding category");
    }
  };

  if (!firm) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{firm.name}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Category name"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Category
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {firm.categories.map((category) => (
            <div
              key={category.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/categories/${category.id}`)}
            >
              <h3 className="text-lg font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
