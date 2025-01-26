// utils/auth.ts
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export async function handleSignOut() {
  const router = useRouter();
  try {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });

    if (response.ok) {
      // Resetujemy dane użytkownika w store
      // Przykład dla Zustand: useUserStore.setState({ user: null });
      toast.success("Successfully signed out.");
      router.push("/signin");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to sign out.");
    }
  } catch (error) {
    console.error("Sign out error:", error);
    toast.error("An error occurred while signing out.");
  }
}
