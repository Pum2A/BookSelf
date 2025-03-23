"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Clock,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  ownerId: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.03, boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.15)" },
};

const SkeletonCard = () => (
  <div className="bg-white/80 dark:bg-gray-800/50 rounded-3xl p-6 h-72 animate-pulse shadow-lg">
    <div className="h-8 bg-indigo-200/60 dark:bg-indigo-900/30 rounded-full w-3/4 mb-6" />
    <div className="h-5 bg-indigo-100/60 dark:bg-indigo-900/20 rounded-full w-full mb-3" />
    <div className="h-5 bg-indigo-100/60 dark:bg-indigo-900/20 rounded-full w-5/6 mb-3" />
    <div className="h-5 bg-indigo-100/60 dark:bg-indigo-900/20 rounded-full w-2/3 mb-8" />
    <div className="h-14 bg-indigo-200/60 dark:bg-indigo-900/30 rounded-2xl w-full" />
  </div>
);

export default function FirmsListPage() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [filteredFirms, setFilteredFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFirms = async () => {
      try {
        const response = await fetch("/api/firms");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setFirms(result.data);
        setFilteredFirms(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFirms();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFirms(firms);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredFirms(
        firms.filter(
          (firm) =>
            firm.name.toLowerCase().includes(lowercasedSearch) ||
            firm.description.toLowerCase().includes(lowercasedSearch) ||
            firm.location.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, firms]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this firm?")) return;

    try {
      const response = await fetch(`/api/firms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete firm");

      setFirms(firms.filter((firm) => firm.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting firm");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-4 md:p-8"
      >
        <div className="max-w-md p-8 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/50 dark:to-pink-950/50 backdrop-blur-lg rounded-3xl border border-red-200 dark:border-red-800/50 shadow-xl">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Loading Error
          </h2>
          <p className="text-red-500 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 text-red-600 dark:text-red-300 rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-950 dark:to-indigo-950">
      <div className="container mx-auto py-8 px-4 md:py-12 md:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 md:mb-16"
        >
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Manage Firms
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Your complete business network in one place
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Link
              href="/firms/create"
              className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg font-medium"
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <Plus className="w-5 h-5" />
              </div>
              <span>Add New Firm</span>
              <ChevronRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search by name, description or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-5 bg-white/80 dark:bg-gray-800/50 dark:text-white text-lg rounded-2xl border-2 border-indigo-100/80 dark:border-indigo-900/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 shadow-lg outline-none transition-all backdrop-blur-sm"
                />
              </div>
              <button className="flex items-center justify-center gap-3 px-6 py-5 bg-white/80 dark:bg-gray-800/50 rounded-2xl border-2 border-indigo-100/80 dark:border-indigo-900/30 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20 transition-colors shadow-lg backdrop-blur-sm text-lg font-medium text-indigo-700 dark:text-indigo-300">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </motion.header>

        <AnimatePresence>
          {filteredFirms.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/60 dark:bg-gray-800/30 rounded-3xl shadow-lg backdrop-blur-sm max-w-2xl mx-auto"
            >
              <div className="text-xl text-gray-500 dark:text-gray-300 mb-6">
                {searchTerm ? "No firms match your search" : "No firms found"}
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-lg underline underline-offset-4"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence>
            {filteredFirms.map((firm, index) => (
              <motion.div
                key={firm.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.05 }}
                whileHover="hover"
                className="group bg-white/80 dark:bg-gray-800/50 rounded-3xl overflow-hidden shadow-lg backdrop-blur-sm border border-indigo-100/80 dark:border-indigo-900/30"
              >
                <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="p-6 md:p-8 relative">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white truncate">
                    {firm.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg line-clamp-2 mb-6 min-h-[3.5rem]">
                    {firm.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-lg truncate">{firm.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-lg truncate">
                        {firm.openingHours}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-indigo-100 dark:border-indigo-900/30">
                    <Link
                      href={`/firms/${firm.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-xl text-indigo-600 dark:text-indigo-400 dark:hover:text-white transition-colors font-medium text-lg"
                    >
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Details</span>
                    </Link>

                    <button
                      onClick={(e) => handleDelete(e, firm.id)}
                      className="p-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Delete firm"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
