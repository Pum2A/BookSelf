"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function ServiceDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = use(props.params);
  const [service, setService] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    details: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${params.id}`);
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setService(data);
        }
      } catch (err) {
        setError("Błąd podczas pobierania usługi");
      }
    };

    fetchService();
  }, [params.id]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: params.id,
          date: bookingData.date,
          time: bookingData.time,
          details: bookingData.details,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/bookings");
      } else {
        setError(data.error || "Nie udało się stworzyć rezerwacji");
      }
    } catch (err: any) {
      setError("Błąd podczas tworzenia rezerwacji");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {service ? (
        <>
          <h1>{service.name}</h1>
          <p>{service.description}</p>
          {/* Tutaj możesz dodać więcej szczegółów usługi */}
          <h2>Rezerwuj usługę</h2>
          <form onSubmit={handleBookingSubmit}>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) =>
                setBookingData({ ...bookingData, date: e.target.value })
              }
              required
            />
            <input
              type="time"
              value={bookingData.time}
              onChange={(e) =>
                setBookingData({ ...bookingData, time: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Szczegóły (np. rodzaj kebaba)"
              value={bookingData.details}
              onChange={(e) =>
                setBookingData({ ...bookingData, details: e.target.value })
              }
            />
            <button type="submit">Rezerwuj</button>
          </form>
        </>
      ) : (
        <p>Ładowanie usługi...</p>
      )}
    </div>
  );
}
