"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { z } from "zod";

// Schemat walidacji dla logowania
const signinSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  password: z
    .string()
    .min(6, { message: "Hasło musi mieć przynajmniej 6 znaków" }),
});

export default function SigninForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja danych przy użyciu Zod
    const result = signinSchema.safeParse({ email, password });
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => err.message)
        .join(". ");
      toast.error(DOMPurify.sanitize(errorMessage));
      return;
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd logowania");
      }
      toast.success("Zalogowano pomyślnie!");
      router.push("/home");
    } catch (error: any) {
      toast.error(DOMPurify.sanitize(error.message || "Błąd logowania"));
    }
  };

  return (
    <div className="max-w-md w-full">
      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Sign In
            </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
