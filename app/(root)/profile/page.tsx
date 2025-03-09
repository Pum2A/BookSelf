// app/profile/page.tsx
"use client";
import { useState, useEffect } from "react";
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
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        bio: user.bio || "",
        avatar: null,
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        avatar: e.target.files![0],
      }));
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
        throw new Error(errorData.message || "Profile update failed");
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
                  className="absolute inset-0 opacity-0 cursor-pointer "
                  id="avatarInput"
                />
                <label
                  htmlFor="avatarInput"
                  className="inline-block px-6 py-3 bg-accents/10 text-accents border-2 border-bg-background rounded-lg cursor-pointer hover:bg-accents/20 transition-colors"
                >
                  {formData.avatar ? "Change Avatar" : "Upload Avatar"}
                </label>
                {formData.avatar && (
                  <span className="ml-4 text-secondText text-sm">
                    {formData.avatar.name}
                  </span>
                )}
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
