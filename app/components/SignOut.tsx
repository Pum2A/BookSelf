// Przykład przycisku do wylogowania w komponencie (np. w `Header`):
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Wyślij zapytanie do endpointu signout
      await fetch("/api/auth/signout", {
        method: "POST",
      });

      // Przekierowanie po wylogowaniu, np. na stronę logowania
      router.refresh();
      router.push("/signin");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out", error);
      toast.error("Failed to sign out");
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
