// app/bookings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";

interface Booking {
  id: string;
  bookingTime: string;
  numberOfPeople: number;
  status: "confirmed" | "pending" | "cancelled";
  serviceName: string;
  businessName: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"current" | "new">("current");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user) {
          setError("Authentication required");
          return;
        }

        const response = await fetch("/api/bookings", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Cancellation failed");
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking cancelled successfully");
    } catch (err: any) {
      toast.error(err.message || "Cancellation failed");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-text mb-4">
            Booking Management
          </h1>
          <div className="flex justify-center gap-4">
            <Button
              variant={viewMode === "current" ? "default" : "outline"}
              onClick={() => setViewMode("current")}
            >
              Current Bookings
            </Button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-8 w-8 text-accents animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 text-red-500">Error: {error}</div>
        )}

        {/* Bookings List */}
        <AnimatePresence>
          {!loading && !error && viewMode === "current" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6"
            >
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-secondText">
                  No upcoming bookings found
                </div>
              ) : (
                bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 bg-sections rounded-xl border border-border/50 hover:border-accents/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-semibold text-text">
                          {booking.serviceName}
                        </h3>
                        <p className="text-secondText">
                          {new Date(booking.bookingTime).toLocaleString()}
                        </p>
                        <div className="flex gap-2 items-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              booking.status === "confirmed"
                                ? "bg-green-500/10 text-green-500"
                                : booking.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-secondText">
                            {booking.numberOfPeople} people
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/bookings/${booking.id}`)}
                        >
                          Details
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={booking.status === "cancelled"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
