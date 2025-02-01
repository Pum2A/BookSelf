"use client";
import { Category } from "@prisma/client";
import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function FirmDetailPage({ params }: { params: { id: string } }) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Access params directly
  const firmId = params.id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/firms/${firmId}/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error("Error loading categories");
      }
    };

    if (firmId) fetchCategories(); // Pobierz kategorie tylko jeśli firmId jest dostępny
  }, [firmId]);

  // Dodawanie nowej kategorii
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
          firmId: firmId, // Przesyłamy firmId jako liczbę
        }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const newCategory = await response.json();
      setCategories([...categories, newCategory.category]);
      setNewCategoryName("");
      toast.success("Category added!");
    } catch (error) {
      toast.error("Error adding category");
    }
  };

  // Edytowanie kategorii
  const handleEditCategory = async (id: number, newName: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) throw new Error("Failed to update category");

      const updatedCategory = await response.json();
      setCategories(
        categories.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
      toast.success("Category updated!");
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  // Usuwanie kategorii
  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((category) => category.id !== id));
      toast.success("Category deleted!");
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  return (
    <div>
      {/* Formularz do dodawania kategorii */}
      <form onSubmit={handleAddCategory}>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Add a new category"
          required
        />
        <button type="submit">Add Category</button>
      </form>

      {/* Lista kategorii */}
      <div>
        <h3>Categories</h3>
        {categories.map((category) => (
          <div key={category.id}>
            <h4>{category.name}</h4>

            {/* Edycja kategorii */}
            <button
              onClick={() => {
                const newName = prompt("New name for category", category.name);
                if (newName) handleEditCategory(category.id, newName);
              }}
            >
              Edit
            </button>

            {/* Usuwanie kategorii */}
            <button onClick={() => handleDeleteCategory(category.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
