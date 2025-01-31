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

  if (loading) return <p>Loading services...</p>;

  return (
    <div>
      <h1>Services</h1>
      <Link href="/services/create">
        <button>Create New Service</button>
      </Link>
      <ul>
        {services.map((service: any) => (
          <li key={service.id}>
            <Link href={`/services/${service.id}`}>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <p>${service.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
