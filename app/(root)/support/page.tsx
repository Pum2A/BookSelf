// app/contact/page.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Failed to send");

      toast.success("Message sent successfully!");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-accents">
          Contact Me
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            className="min-h-[150px]"
            required
          />

          <Button
            type="submit"
            className="w-full bg-accents hover:bg-accents-dark"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
