// components/HomePage.tsx
"use client";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeProvider";
import { AiOutlineSearch } from "react-icons/ai";
import Image from "next/image";

export default function HomePage() {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-block bg-accents/10 px-6 py-2 rounded-full mb-6">
            <span className="text-accents text-sm">
              🚀 Discover Premium Services
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-text to-accents bg-clip-text text-transparent">
            Elevate Your
            <span className="block mt-4 bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="flex w-full bg-sections shadow-xl rounded-xl overflow-hidden border border-border/50">
            <input
              type="text"
              className="flex-grow px-6 py-4 bg-transparent text-text placeholder-secondText outline-none"
              placeholder="Find premium services..."
            />
            <button className="px-6 py-4 bg-accents hover:bg-accents-dark text-text transition-colors">
              <AiOutlineSearch size={24} />
            </button>
          </div>
        </motion.div>

        {/* Featured Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="relative group rounded-3xl overflow-hidden border border-border/50"
          >
            <Image
              src="/imageMain.png"
              width={600}
              height={400}
              alt="Services"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <p className="text-xl text-secondText leading-relaxed">
              Experience seamless service booking with our curated selection of
              premium providers and intelligent matching system.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Instant Booking",
                "Verified Providers",
                "Secure Payments",
                "24/7 Support",
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 bg-sections rounded-xl border border-border hover:border-accents/30 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-accents mb-2" />
                  <span className="text-text">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: "🚀",
              title: "Fast Booking",
              desc: "Instant reservations with real-time availability",
            },
            {
              icon: "🛡️",
              title: "Secure",
              desc: "End-to-end encrypted transactions",
            },
            {
              icon: "💎",
              title: "Premium",
              desc: "Curated selection of top providers",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-sections rounded-2xl border border-border/50 hover:border-accents/30 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-text">
                {feature.title}
              </h3>
              <p className="text-secondText">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
