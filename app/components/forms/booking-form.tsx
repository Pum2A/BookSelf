import React, { useState } from "react";
import { useBooking } from "@/app/contexts/BookingContext";

const BookingForm = () => {
  const { addBooking } = useBooking();
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      id: Date.now(),
      userId: 1, // Replace with actual user ID
      businessId: 1, // Replace with actual business ID
      service,
      date,
      time,
    };
    addBooking(newBooking);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Service"
        value={service}
        onChange={(e) => setService(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button type="submit">Book</button>
    </form>
  );
};

export default BookingForm;
