// app/signup/page.tsx
"use client";
import { motion } from "framer-motion";
import SignUpForm from "@/app/components/forms/signup-form";

export default function SignUpRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-sections">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <SignUpForm />
      </motion.div>
    </div>
  );
}
