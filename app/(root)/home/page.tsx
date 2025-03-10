"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export default function HomePage({}) {
  const router = useRouter();
  const { user } = useUserStore();
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  return (
    <section className="relative min-h-screen py-12 md:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-24"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-accents/10 px-4 py-1 md:px-6 md:py-2 rounded-full mb-4 md:mb-6 backdrop-blur-sm border border-accents/20"
          >
            <span className="text-accents text-sm md:text-base uppercase tracking-wide font-medium">
              🚀 Premium Service Ecosystem
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              Next Generation
            </span>
            <span className="block mt-2 md:mt-4 bg-gradient-to-r from-text via-accents to-accents-dark bg-clip-text text-transparent">
              Service Platform
            </span>
          </h1>
        </motion.div>

        {/* Mobile-optimized CTA Button */}
        <motion.div className="max-w-md mx-auto mb-12 md:mb-24">
          <motion.button
            onClick={() => {
              if (!user) return;
              router.push(user.role === "CUSTOMER" ? "/bookings" : "/firms");
            }}
            className="w-full relative bg-gradient-to-br from-accents to-accents-dark text-text px-6 py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl shadow-lg border-2 border-accents/30 font-semibold"
            whileHover={{ scale: isMobile ? 1 : 1.02 }}
          >
            <span className="flex items-center justify-center gap-2">
              {user && user.role === "CUSTOMER"
                ? "Explore Bookings"
                : "Manage Firms"}
              <span className="hidden md:inline">→</span>
            </span>
          </motion.button>
        </motion.div>

        {/* Responsive Feature Section */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-28">
          <motion.div
            className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-accents/20 bg-sections/20 backdrop-blur-xl "
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative  md:h-[500px]">
              <Image
                src="/imageMain.png"
                fill
                alt="Services"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Feature List */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-6 md:space-y-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              Intelligent Service Matrix
            </h2>
            <div className="space-y-4 md:space-y-8">
              {[
                {
                  title: "AI Matching",
                  desc: "Smart algorithm connects you with ideal providers",
                  icon: "🤖",
                },
                {
                  title: "Dynamic Pricing",
                  desc: "Real-time market-adjusted pricing models",
                  icon: "💸",
                },
                {
                  title: "Quality Assurance",
                  desc: "Blockchain-verified service records",
                  icon: "🔗",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-4 md:p-6 bg-sections/30 rounded-xl md:rounded-2xl border border-accents/20 backdrop-blur-lg"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <span className="text-2xl md:text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 text-text">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-secondText/80">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Responsive Feature Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-4 md:gap-8 mb-16 md:mb-28"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {[
            {
              icon: "🌐",
              title: "Global Network",
              desc: "Access providers worldwide",
            },
            {
              icon: "📊",
              title: "Analytics Suite",
              desc: "Real-time business insights",
            },
            {
              icon: "🔐",
              title: "Enterprise Security",
              desc: "Military-grade encryption",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-4 md:p-6 bg-sections/20 rounded-xl md:rounded-3xl border border-accents/20 backdrop-blur-sm md:backdrop-blur-xl"
            >
              <div className="text-4xl md:text-5xl mb-4 md:mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-text">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-secondText/80">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
