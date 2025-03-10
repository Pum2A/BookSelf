"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  AiOutlineInfoCircle,
  AiOutlineTeam,
  AiOutlineSafety,
} from "react-icons/ai";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: AiOutlineInfoCircle,
    title: "Comprehensive Details",
    description:
      "Access detailed service information with real-time availability updates and transparent pricing.",
  },
  {
    icon: AiOutlineTeam,
    title: "Expert Support",
    description:
      "24/7 customer support team ready to assist you with any queries or issues.",
  },
  {
    icon: AiOutlineSafety,
    title: "Secure Transactions",
    description:
      "Bank-grade encryption ensures all your transactions and data remain protected.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen w-full text-text py-12 md:py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-20 space-y-4 md:space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
            About BookSelf
          </h1>
          <p className="text-lg md:text-xl text-secondText max-w-3xl mx-auto leading-relaxed">
            Revolutionizing the way you book services with cutting-edge
            technology and user-centric design principles.
          </p>
        </motion.div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square md:aspect-video rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl"
          >
            <Image
              src="/bookAbout.svg"
              alt="About BookSelf"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Empowering Modern Bookings
            </h2>
            <p className="text-base md:text-lg text-secondText leading-relaxed">
              Our platform combines intuitive design with powerful features to
              create seamless booking experiences. Whether you're managing
              personal appointments or business reservations, BookSelf adapts to
              your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <motion.button>
                <Button className="bg-accents hover:bg-accents-dark text-text rounded-lg md:rounded-xl px-6 py-5 md:px-8 md:py-6 text-base md:text-lg transition-all">
                  Get Started
                </Button>
              </motion.button>
              <Button
                variant="outline"
                className="border-border text-text hover:bg-sections rounded-lg md:rounded-xl px-6 py-5 md:px-8 md:py-6 text-base md:text-lg transition-all"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <section className="mb-16 md:mb-24">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-16">
            Why Choose BookSelf?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 md:p-8 bg-sections rounded-xl md:rounded-2xl border border-border/30 hover:border-accents/50 transition-all"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 mb-4 md:mb-6 flex items-center justify-center bg-accents/10 rounded-lg md:rounded-xl">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-accents" />
                  </motion.div>
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-secondText/90 leading-relaxed">
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
          className="bg-gradient-to-r from-accents/10 to-transparent rounded-xl md:rounded-2xl p-6 md:p-12 text-center border border-accents/20"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Start Your Journey Today
          </h3>
          <p className="text-secondText mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
            Join thousands of satisfied users who have transformed their booking
            experience with BookSelf.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-accents hover:bg-accents-dark text-text rounded-lg md:rounded-xl px-8 py-6 md:px-10 md:py-7 text-base md:text-lg shadow-md">
              Create Free Account
            </Button>
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
