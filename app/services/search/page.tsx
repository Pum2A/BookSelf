"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchServicesPage() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Przykładowe pobieranie usług – zaimplementuj swój własny mechanizm wyszukiwania
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services"); // endpoint do pobierania listy usług
        const data = await res.json();
        setServices(data.services);
      } catch (err) {
        setError("Błąd podczas pobierania usług");
      }
    };
    fetchServices();
  }, []);

  const handleSelectService = (id: number) => {
    // Po wybraniu usługi przechodzimy do strony szczegółów
    router.push(`/services/${id}`);
  };

  return (
    <div>
      <h1>Wyszukaj firmę</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {services.map((service: any) => (
          <li key={service.id} onClick={() => handleSelectService(service.id)}>
            {service.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
