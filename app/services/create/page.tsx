"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateServicePage() {
  const [services, setServices] = useState([
    { name: "", description: "", price: "" },
  ]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleServiceChange = (
    index: number,
    field: "name" | "description" | "price",
    value: string
  ) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const handleAddService = () => {
    setServices([...services, { name: "", description: "", price: "" }]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    setServices(newServices);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const response = await fetch("/api/services/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });

    if (response.ok) {
      router.push("/services");
    } else {
      const data = await response.json();
      setError(data.error || "Failed to create services");
    }
  };

  return (
    <div>
      <h1>Create Services</h1>
      <form onSubmit={handleSubmit}>
        {services.map((service, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Name"
              value={service.name}
              onChange={(e) =>
                handleServiceChange(index, "name", e.target.value)
              }
              required
            />
            <textarea
              placeholder="Description"
              value={service.description}
              onChange={(e) =>
                handleServiceChange(index, "description", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={service.price}
              onChange={(e) =>
                handleServiceChange(index, "price", e.target.value)
              }
              required
            />
            <button type="button" onClick={() => handleRemoveService(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddService}>
          Add Service
        </button>
        <button type="submit">Create</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
