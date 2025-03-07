"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  useEffect(() => {
    // Po 3 sekundach przekierowujemy użytkownika na /home
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
      <p className="text-lg text-secondText mb-4">
        You do not have permission to access this page.
      </p>
      <p className="text-secondText">Redirecting to Home in 3 seconds...</p>
    </div>
  );
}
