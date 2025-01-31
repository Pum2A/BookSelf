import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface AuthData {
  email: string;
  username?: string;
  password: string;
}

// Funkcja do logowania użytkownika
async function signinUser({ email, password }: AuthData) {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to sign in. Please try again.");
  }

  return response.json();
}

// Funkcja do rejestracji użytkownika
async function signupUser({ email, username, password }: AuthData) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create account. Please try again.");
  }

  return response.json();
}

// Hook do logowania
export function useSigninUser() {
  const router = useRouter();

  return useMutation({
    mutationFn: signinUser,
    onMutate: () => {
      toast.info("Signing in...");
      
    },
    onSuccess: (data) => {
      toast.success("Successfully signed in!");
      router.push("/home");
      router.refresh();

    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook do rejestracji
export function useSignupUser() {
  const router = useRouter();

  return useMutation({
    mutationFn: signupUser,
    onMutate: () => {
      toast.info("Creating account...");
    },
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      router.push("/signin");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
