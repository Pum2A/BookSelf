// app/signup/page.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, CalendarCheck, Shield } from "lucide-react";
import AuthForm from "@/app/components/forms/auth-form";

export default function SignUpRoute() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Section - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:w-1/2 bg-gradient-to-br from-accents/10 to-background p-12 flex flex-col justify-center relative overflow-hidden"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <span className="text-3xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              BookSelf
            </span>
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accents/10">
                <CalendarCheck className="w-8 h-8 text-accents" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">
                  Inteligentne Zarządzanie Czasem
                </h3>
                <p className="text-secondText">
                  Automatyczna optymalizacja grafiku i powiadomienia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accents/10">
                <Shield className="w-8 h-8 text-accents" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">
                  Bezpieczna Platforma
                </h3>
                <p className="text-secondText">
                  Szyfrowane połączenia i weryfikacja dwuetapowa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accents/10">
                <BookOpen className="w-8 h-8 text-accents" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">
                  Dobra opinia
                </h3>
                <p className="text-secondText">
                  Dołącz do najlepszych specjalistów w branży
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 text-secondText text-sm"></div>
      </motion.div>

      {/* Right Section - Form */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-sections"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text mb-2">
              Dołącz do BookSelf
            </h1>
            <p className="text-secondText">
              Zarządzaj rezerwacjami w jednym miejscu
            </p>
          </div>

          <AuthForm type={"signup"} />

          <div className="text-center text-sm text-secondText">
            Rejestrując się akceptujesz{" "}
            <Link href="/terms" className="text-accents hover:underline">
              Regulamin
            </Link>{" "}
            i{" "}
            <Link href="/privacy" className="text-accents hover:underline">
              Politykę Prywatności
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
