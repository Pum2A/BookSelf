// app/bookings/[id]/page.tsx
"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching booking:", error));
  }, [id]);

  if (loading) return <p>Loading booking...</p>;
  if (!booking) return <p>Booking not found</p>;

  return (
    <div>
      <h1>Booking #{booking.id}</h1>
      <p>Service: {booking.service.name}</p>
      <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
      <p>Time: {new Date(booking.time).toLocaleTimeString()}</p>
      <button onClick={() => router.push(`/bookings/${id}/edit`)}>Edit</button>
    </div>
  );
}
