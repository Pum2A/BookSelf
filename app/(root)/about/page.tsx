"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Info,
  Users,
  Shield,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Info,
    title: "Comprehensive Details",
    description:
      "Access detailed service information with real-time availability updates and transparent pricing.",
  },
  {
    icon: Users,
    title: "Expert Support",
    description:
      "24/7 customer support team ready to assist you with any queries or issues.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Bank-grade encryption ensures all your transactions and data remain protected.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.15)" },
};

export default function About() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-indigo-950 py-12 md:py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24 space-y-4 md:space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-white/60 dark:bg-indigo-900/30 border border-indigo-100/80 dark:border-indigo-900/30 px-6 py-2 rounded-full mb-4 md:mb-6 backdrop-blur-sm transition-colors shadow-sm"
          >
            <span className="text-indigo-600 dark:text-indigo-400 text-sm md:text-base uppercase tracking-widest font-semibold">
              A Cutting-Edge Platform
            </span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              About BookSelf
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing the way you book services through innovative
            technology and user-centric design. Our platform empowers you with
            seamless, intuitive solutions tailored for modern needs.
          </p>
        </motion.div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-2xl border border-indigo-100/80 dark:border-indigo-900/30 transition-transform hover:-translate-y-1"
          >
            <Image
              src="/bookAbout.svg"
              alt="About BookSelf"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8 transition-transform hover:-translate-y-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Empowering Modern Bookings
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Our platform combines intuitive design with powerful features to
              create seamless booking experiences. Whether you're managing
              personal appointments or business reservations, BookSelf adapts to
              your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-medium">
                  <span>Get Started</span>
                  <ChevronRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/80 dark:bg-gray-800/50 border-2 border-indigo-100/80 dark:border-indigo-900/30 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-8 py-6 rounded-2xl shadow-lg transition-all text-lg font-medium"
              >
                <span>Learn More</span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section className="mb-16 md:mb-24">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose BookSelf?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/80 dark:bg-gray-800/50 rounded-3xl overflow-hidden shadow-lg backdrop-blur-sm border border-indigo-100/80 dark:border-indigo-900/30 p-6 md:p-8"
              >
                <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -mx-6 md:-mx-8 mb-6" />
                <div className="w-14 h-14 mb-6 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                  <feature.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 dark:bg-gray-800/50 rounded-3xl p-8 md:p-12 text-center border border-indigo-100/80 dark:border-indigo-900/30 shadow-2xl backdrop-blur-sm"
        >
          <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -mx-8 md:-mx-12 mb-8" />
          <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Start Your Journey Today
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied users who have transformed their booking
            experience with BookSelf.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>Create Free Account</span>
              <ChevronRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
