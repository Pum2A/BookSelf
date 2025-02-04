"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation"; // Importujemy useRouter

export default function Profile() {
  const { user, setUser } = useUserStore();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Hook do przekierowania

  // Ustawienie początkowych wartości z user w store
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || "");
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !bio) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        const updatedUser = await response.json();
        setUser(updatedUser.user); // Zaktualizowanie stanu w Zustand po pomyślnym zapisie

        // Przekierowanie na stronę główną i odświeżenie danych
        router.push("/home");
        router.refresh(); // Odświeżenie strony, aby dane były widoczne
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-white">
          Edit Your Profile
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-white">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="mt-2 bg-gray-700 text-white border-0 focus:ring-2 focus:ring-green-400 rounded-md py-2 px-4 w-full"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-white">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself"
              className="mt-2 bg-gray-700 text-white border-0 focus:ring-2 focus:ring-green-400 rounded-md py-2 px-4 w-full"
            />
          </div>

          <div>
            <Label htmlFor="avatar" className="text-white">
              Avatar
            </Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mt-2 bg-gray-700 text-white file:border-0 file:bg-green-400 file:text-white file:rounded-md hover:file:bg-green-500 focus:ring-2 focus:ring-green-400 w-full"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-400 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition duration-200 disabled:bg-gray-500"
          disabled={loading}
        >
          {loading ? "Updating Profile..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
