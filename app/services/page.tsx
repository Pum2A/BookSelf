// app/services/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services/list")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-400">Loading services...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Services</h1>
        <div className="flex justify-center mb-6">
          <Link href="/services/create">
            <button className="px-6 py-3 bg-green-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-green-500 transition">
              Create New Service
            </button>
          </Link>
        </div>
        <ul className="space-y-6">
          {services.map((service: any) => (
            <li
              key={service.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <Link href={`/services/${service.id}`} className="block">
                <h2 className="text-2xl font-semibold text-green-400 mb-2">
                  {service.name}
                </h2>
                <p className="text-gray-300 mb-2">{service.description}</p>
                <p className="text-lg font-semibold text-white">
                  ${service.price}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
