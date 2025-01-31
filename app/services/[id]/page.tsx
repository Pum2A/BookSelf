// app/services/[id]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching service:", error));
  }, [id]);

  if (loading) return <p>Loading service...</p>;
  if (!service) return <p>Service not found</p>;

  return (
    <div>
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <p>${service.price}</p>
      <button onClick={() => router.push(`/services/${id}/edit`)}>Edit</button>
    </div>
  );
}
