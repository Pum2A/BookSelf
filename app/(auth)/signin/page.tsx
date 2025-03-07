// app/signin/page.tsx
"use client";
import { motion } from "framer-motion";
import SigninForm from "@/app/components/forms/signin-form";

export default function SignInRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-sections">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <SigninForm />
      </motion.div>
    </div>
  );
}
