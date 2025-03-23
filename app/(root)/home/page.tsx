"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const buttonVariants: Variants = {
  initial: { scale: 1, boxShadow: "0px 2px 6px rgba(0,0,0,0.1)" },
  hover: {
    scale: 1.03,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
  },
  tap: { scale: 0.98 },
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <section className="relative min-h-screen py-12 md:py-20 bg-background overflow-hidden font-poppins text-text">
      <div className="container mx-auto px-4 md:px-8 relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16 md:mb-24"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-accents/10 px-6 py-2 rounded-full mb-4 md:mb-6 backdrop-blur-sm transition-colors"
          >
            <span className="text-accents text-sm md:text-base uppercase tracking-widest font-semibold">
              Seamless & Intuitive Experience
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="block bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              Innovate.
            </span>
            <span className="block mt-2 bg-gradient-to-r from-text via-accents to-accents-dark bg-clip-text text-transparent">
              Book. Transform.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-secondText max-w-3xl mx-auto leading-relaxed">
            Discover a next-generation booking platform designed for speed,
            simplicity, and an unforgettable user experience.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div className="max-w-md mx-auto mb-16 md:mb-24">
          <motion.button
            onClick={() => {
              if (!user) return;
              // Dla przykładu: różne animacje przycisku "Manage Firms"
              router.push(user.role === "CUSTOMER" ? "/bookings" : "/firms");
            }}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            className="w-full relative bg-gradient-to-br from-accents to-accents-dark text-text px-8 py-5 rounded-2xl shadow-2xl font-semibold transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              {user && user.role === "CUSTOMER"
                ? "Discover Bookings"
                : "Manage Firms"}
              <span className="hidden md:inline">→</span>
            </span>
          </motion.button>
        </motion.div>

        {/* Responsive Feature Section */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-28">
          <motion.div
            className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-sections/30 backdrop-blur-xl shadow-2xl transition-transform hover:-translate-y-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative md:h-[500px]">
              <Image
                src="/imageMain.png"
                fill
                alt="Innovative Services"
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Feature List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              Intelligent Service Matrix
            </h2>
            <div className="space-y-4 md:space-y-8">
              {[
                {
                  title: "AI Matching",
                  desc: "Our smart algorithm instantly finds the perfect service provider for you.",
                  icon: "🤖",
                },
                {
                  title: "Dynamic Pricing",
                  desc: "Experience pricing that adapts in real-time to your needs.",
                  icon: "💸",
                },
                {
                  title: "Quality Assurance",
                  desc: "Enjoy complete peace of mind with verified service records.",
                  icon: "🔗",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-6 bg-sections/30 rounded-2xl shadow-xl transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold mb-1 text-text">
                        {item.title}
                      </h3>
                      <p className="text-base text-secondText">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Responsive Feature Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 md:gap-10 mb-16 md:mb-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[
            {
              icon: "🌐",
              title: "Global Network",
              desc: "Seamlessly connect with top providers worldwide.",
            },
            {
              icon: "📊",
              title: "Analytics Suite",
              desc: "Gain actionable insights with real-time analytics.",
            },
            {
              icon: "🔐",
              title: "Enterprise Security",
              desc: "Your data is safeguarded with cutting-edge encryption.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 bg-sections/20 rounded-3xl shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2 text-text">
                {feature.title}
              </h3>
              <p className="text-base text-secondText">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
