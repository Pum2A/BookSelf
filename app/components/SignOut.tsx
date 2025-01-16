// Przykład przycisku do wylogowania w komponencie (np. w `Header`):
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Wyślij zapytanie do endpointu signout
      await fetch("/api/auth/signout", {
        method: "POST",
      });

      // Przekierowanie po wylogowaniu, np. na stronę logowania
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
