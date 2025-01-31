// app/bookings/page.tsx
"use client";
import Link from "next/link";

export default function BookingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/bookings/create">
          <div className="p-6 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Create Booking</h2>
            <p className="text-gray-600">
              Book a new service by selecting a date, time, and service.
            </p>
          </div>
        </Link>
        <Link href="/bookings/search">
          <div className="p-6 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Search Services</h2>
            <p className="text-gray-600">
              Find available services and book them directly.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
