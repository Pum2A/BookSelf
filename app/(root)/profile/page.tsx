"use client";
import { useState, useEffect } from "react";
import Image from "next/image"; // New import for optimized images
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: null as File | null,
  });

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user?.username || "",
        bio: user?.bio || "",
        avatar: null,
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Proszę wybrać plik obrazu");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Maksymalny rozmiar pliku to 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      // Generate image preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("bio", formData.bio);
      if (formData.avatar) {
        formPayload.append("avatar", formData.avatar);
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Profile update failed");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-sections rounded-2xl border border-border/50 p-8 space-y-8 shadow-xl"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text text-center">
            Profile Settings
          </h1>
          <p className="text-secondText text-center">
            Manage your account information
          </p>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-4">
            <Label className="text-text">Profile Picture</Label>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  id="avatarInput"
                />
                <label
                  htmlFor="avatarInput"
                  className="inline-flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-accents/20 hover:border-accents/50 transition-all">
                    {avatarPreview && (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill // fills the parent container
                        style={{ objectFit: "cover" }}
                        sizes="96px" // ensures optimal sizing for a 24x24 rem container
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm text-center">
                        Change Avatar
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-accents hover:text-accents-dark">
                    {formData.avatar ? "Change" : "Upload"} Avatar
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-4">
            <Label className="text-text">Username</Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="bg-background border-border focus:ring-2 focus:ring-accents"
              required
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-4">
            <Label className="text-text">Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              className="bg-background border-border focus:ring-2 focus:ring-accents min-h-[150px]"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-4 bg-accents hover:bg-accents-dark text-text rounded-xl font-medium transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving Changes...
              </div>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
