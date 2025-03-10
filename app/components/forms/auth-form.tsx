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
import { z } from "zod";
import { toast } from "sonner";

type AuthType = "signin" | "signup";

interface AuthFormProps {
  type: AuthType;
}

const schemas = {
  signup: z.object({
    email: z.string().email({ message: "Nieprawidłowy adres email" }),
    username: z
      .string()
      .min(3, { message: "Username musi mieć przynajmniej 3 znaki" }),
    password: z
      .string()
      .min(6, { message: "Hasło musi mieć przynajmniej 6 znaków" }),
  }),
  signin: z.object({
    email: z.string().email({ message: "Nieprawidłowy adres email" }),
    password: z
      .string()
      .min(6, { message: "Hasło musi mieć przynajmniej 6 znaków" }),
  }),
};

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const schema = schemas[type];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData: any = { email, password };
    if (type === "signup") {
      formData.username = username;
    }
    const result = schema.safeParse(formData);
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => err.message)
        .join(". ");
      toast.error("Błąd walidacji", { description: errorMessage });
      return;
    }

    try {
      const endpoint =
        type === "signup" ? "/api/auth/signup" : "/api/auth/signin";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error ||
            `Błąd ${type === "signup" ? "rejestracji" : "logowania"}`
        );
      }
      toast.success(
        `Konto ${type === "signup" ? "utworzone" : "zalogowane"}!`,
        {
          description: "Za chwilę nastąpi przekierowanie.",
        }
      );
      router.push("/home");
    } catch (error: any) {
      toast.error(`Błąd ${type === "signup" ? "rejestracji" : "logowania"}`, {
        description: error.message,
      });
    }
  };

  return (
    <div className="max-w-md w-full">
      <form onSubmit={handleSubmit}>
        <Card className="shadow-lg border border-gray-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">
              {type === "signup" ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {type === "signup"
                ? "Fill in the details to create your account"
                : "Enter your credentials to access your account"}
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
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}
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
              className={`w-full ${
                type === "signup"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white py-2 px-4 rounded-lg transition duration-200`}
            >
              {type === "signup" ? "Sign Up" : "Sign In"}
            </button>
            <p className="text-center text-sm text-gray-500">
              {type === "signup" ? (
                <>
                  Already have an account?{" "}
                  <a href="/signin" className="text-green-500 underline">
                    Log in
                  </a>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <a href="/signup" className="text-blue-500 underline">
                    Sign up
                  </a>
                </>
              )}
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
