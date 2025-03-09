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
    <main className="min-h-screen w-full text-text py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20 space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
            About BookSelf
          </h1>
          <p className="text-xl text-secondText max-w-3xl mx-auto leading-relaxed">
            Revolutionizing the way you book services with cutting-edge
            technology and user-centric design principles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/bookAbout.svg"
              alt="About BookSelf"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold">Empowering Modern Bookings</h2>
            <p className="text-lg text-secondText leading-relaxed">
              Our platform combines intuitive design with powerful features to
              create seamless booking experiences. Whether you're managing
              personal appointments or business reservations, BookSelf adapts to
              your needs.
            </p>
            <div className="flex gap-4">
              <Button className="bg-accents hover:bg-accents-dark text-text rounded-xl px-8 py-6 text-lg">
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-border text-text hover:bg-sections rounded-xl px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>

        <section className="mb-24">
          <h3 className="text-4xl font-bold text-center mb-16">
            Why Choose BookSelf?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-8 bg-sections rounded-2xl border border-border/50 hover:border-accents/30 transition-all"
              >
                <div className="w-14 h-14 mb-6 flex items-center justify-center bg-accents/10 rounded-xl">
                  <feature.icon className="w-8 h-8 text-accents" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-secondText leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-accents/10 to-transparent rounded-2xl p-12 text-center border border-accents/20"
        >
          <h3 className="text-3xl font-bold mb-6">Start Your Journey Today</h3>
          <p className="text-secondText mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their booking
            experience with BookSelf.
          </p>
          <Button className="bg-accents hover:bg-accents-dark text-text rounded-xl px-10 py-7 text-lg shadow-lg">
            Create Free Account
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
