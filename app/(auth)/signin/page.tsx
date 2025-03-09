// app/signin/page.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import SigninForm from "@/app/components/forms/signin-form";
import { Lock, Sparkles, UserCheck } from "lucide-react";

export default function SignInRoute() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Section - Features */}
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
                <Sparkles className="w-8 h-8 text-accents" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">
                  Personalizowane Rekomendacje
                </h3>
                <p className="text-secondText">
                  Inteligentny system dopasowany do Twoich preferencji
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accents/10">
                <Lock className="w-8 h-8 text-accents" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">
                  Bezpieczne Logowanie
                </h3>
                <p className="text-secondText">
                  Weryfikacja dwuetapowa i szyfrowanie danych
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accents/10">
                <UserCheck className="w-8 h-8 text-accents" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text">
                  150k+ Zadowolonych Klientów
                </h3>
                <p className="text-secondText">
                  Dołącz do społeczności profesjonalistów
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
              Witaj ponownie
            </h1>
            <p className="text-secondText">Zaloguj się, aby kontynuować</p>
          </div>

          <SigninForm />

          <div className="text-center"></div>
        </div>
      </motion.div>
    </div>
  );
}
