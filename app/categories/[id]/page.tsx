// app/categories/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  services: Service[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
  });

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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newService,
          price: parseFloat(newService.price),
          categoryId: id,
        }),
      });

      if (!response.ok) throw new Error("Failed to add service");

      const newServiceData = await response.json();
      setCategory((prev) =>
        prev
          ? {
              ...prev,
              services: [...prev.services, newServiceData.service],
            }
          : null
      );

      setNewService({ name: "", description: "", price: "" });
      toast.success("Service added!");
    } catch (error) {
      toast.error("Error adding service");
    }
  };

  if (!category) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block mb-2">Service Name</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <textarea
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Price</label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              className="w-full p-2 border rounded"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Add Service
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Services</h2>
        <div className="grid grid-cols-1 gap-4">
          {category.services.map((service) => (
            <div key={service.id} className="p-4 border rounded">
              <h3 className="text-lg font-medium">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-green-600 font-semibold mt-2">
                ${service.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
