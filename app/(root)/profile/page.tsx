"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, User, FileEdit, Camera, CheckCircle } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.15)" },
};

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
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Maximum file size is 5MB");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/50 rounded-3xl border border-indigo-100/80 dark:border-indigo-900/30 p-8 space-y-8 shadow-xl backdrop-blur-sm"
      >
        <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -mx-8 mb-6" />

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Manage your account information
          </p>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-200">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Profile Picture</span>
            </Label>
            <div className="flex items-center justify-center">
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  id="avatarInput"
                />
                <label
                  htmlFor="avatarInput"
                  className="inline-flex flex-col items-center gap-3 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-600 transition-all shadow-lg"
                  >
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50">
                        <User className="w-16 h-16 text-indigo-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    {formData.avatar ? "Change Photo" : "Upload Photo"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-200">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Username</span>
            </Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="bg-white/60 dark:bg-gray-800/30 border-2 border-indigo-100/80 dark:border-indigo-900/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 px-4 py-3 rounded-xl text-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Bio Field */}
          <div className="space-y-4">
            <Label className="flex items-center gap-3 text-lg font-medium text-gray-700 dark:text-gray-200">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <FileEdit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span>Bio</span>
            </Label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              className="bg-white/60 dark:bg-gray-800/30 border-2 border-indigo-100/80 dark:border-indigo-900/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 px-4 py-3 rounded-xl text-gray-800 dark:text-white min-h-32 resize-none"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
