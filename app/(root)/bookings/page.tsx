"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, AlertCircle, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface Firm {
  id: number;
  name: string;
  description: string;
  location: string;
  openingHours: string;
  address: string;
  imagePath: string | null;
  menuItems: MenuItem[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Firm[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export default function ServicesPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/menu-items/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Błąd pobierania kategorii:", err);
      }
    };

    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        category: selectedCategory,
      });

      const res = await fetch(`/api/firms?${params}`);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error! Status: ${res.status}`);
      }

      const responseData: ApiResponse = await res.json();

      if (!responseData.success) {
        throw new Error(responseData.message || "Błąd pobierania danych");
      }

      setData(responseData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Wystąpił błąd podczas ładowania danych");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-background min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto mb-10 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
          Dostępne Usługi
        </h1>
        <p className="text-secondText/80 text-lg mb-6">
          Odkryj najlepsze usługi w Twojej okolicy
        </p>

        <div className="bg-sections/5 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-border/20">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondText/60 w-5 h-5 group-focus-within:text-accents transition-colors" />
              <Input
                placeholder="Wyszukaj usługę lub firmę..."
                value={searchTerm}
                onChange={handleSearch}
                className="rounded-xl py-5 pl-10 pr-4 h-19.5 text-base border-border/50 bg-background/50 hover:bg-background/70 focus:ring-2 focus:ring-accents/30 focus:border-accents/50 transition-all"
              />
            </div>
            <div className="relative group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondText/60 w-5 h-5 group-focus-within:text-accents transition-colors" />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="rounded-xl py-5 h-19.5 pl-10 pr-4 text-base border-border/50 bg-background/50 hover:bg-background/70 focus:ring-2 focus:ring-accents/30 focus:border-accents/50 appearance-none transition-all w-full"
              >
                <option value="all">Wszystkie kategorie</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 p-4 rounded-lg flex items-center gap-3 mb-6 border border-red-500/20 max-w-4xl mx-auto"
        >
          <AlertCircle className="w-5 h-5 text-red-500/80" />
          <p className="text-red-500/90">{error}</p>
        </motion.div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="animate-spin w-10 h-10 text-accents" />
        </div>
      ) : (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {data?.data?.length ? (
            data.data.map((firm) => (
              <motion.div
                key={firm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-border/20 rounded-2xl bg-background/50 backdrop-blur-sm hover:backdrop-blur-md shadow-sm hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="w-full md:w-56 h-44 relative rounded-xl overflow-hidden bg-sections/10 border border-border/20"
                    >
                      {firm.imagePath ? (
                        <Image
                          src={
                            firm.imagePath.startsWith("/")
                              ? firm.imagePath
                              : `/${firm.imagePath}`
                          }
                          alt={firm.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 224px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-accents/10 to-accents/5 flex items-center justify-center">
                          <div className="text-secondText/40">
                            <Image
                              src="/placeholder.svg"
                              width={64}
                              height={64}
                              alt="Brak zdjęcia"
                              priority
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>

                    <div className="flex-1 space-y-4">
                      <h2 className="text-2xl font-bold text-text">
                        {firm.name}
                      </h2>
                      <p className="text-secondText/80 leading-relaxed">
                        {firm.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 bg-accents/5 text-accents rounded-lg text-sm border border-accents/10">
                          📍 {firm.location}
                        </div>
                        <div className="px-3 py-1.5 bg-accents/5 text-accents rounded-lg text-sm border border-accents/10">
                          🕒 {firm.openingHours}
                        </div>
                      </div>

                      <div className="text-sm text-secondText/70 flex items-center gap-2">
                        <span className="text-text/80">🏠</span>
                        {firm.address}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/20">
                    <h3 className="text-lg font-semibold mb-4 text-text/90">
                      📋 Dostępne usługi
                    </h3>
                    <div className="grid gap-3">
                      {firm.menuItems?.length > 0 ? (
                        firm.menuItems.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ translateX: 5 }}
                            className="p-4 rounded-xl bg-sections/5 hover:bg-sections/10 border border-border/20 transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="text-base font-medium text-text">
                                  {item.name}
                                </h4>
                                <p className="text-secondText/70 text-sm">
                                  {item.description}
                                </p>
                                <span className="inline-block px-2 py-0.5 bg-accents/5 text-accents text-xs rounded-md border border-accents/10">
                                  {item.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 min-w-fit">
                                <span className="text-lg font-bold text-accents/90">
                                  {item.price.toLocaleString()} zł
                                </span>
                                <Link
                                  href={`/book-service?firmId=${firm.id}&menuItemId=${item.id}`}
                                  className="px-4 py-2.5 bg-accents hover:bg-accents/90 text-white rounded-lg font-medium flex items-center gap-2 transition-all"
                                >
                                  <span>Rezerwuj</span>
                                  <span className="text-lg">→</span>
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-secondText/70 bg-sections/5 rounded-xl border border-border/20">
                          🚫 Brak dostępnych usług
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 border border-border/20 rounded-2xl bg-background/50 backdrop-blur-sm"
            >
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold mb-2 text-text/90">
                Brak wyników
              </h3>
              <p className="text-secondText/70">
                Nie znaleziono firm spełniających kryteria wyszukiwania.
              </p>
            </motion.div>
          )}

          {(data?.pagination?.totalPages ?? 0) > 1 && (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-accents/10 text-accents rounded-lg hover:bg-accents/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Poprzednia
              </button>

              <div className="flex gap-2 flex-wrap justify-center">
                {Array.from(
                  { length: data!.pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-accents text-white"
                        : "bg-sections/10 text-text hover:bg-sections/20"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, data!.pagination.totalPages)
                  )
                }
                disabled={currentPage === data!.pagination.totalPages}
                className="px-4 py-2 bg-accents/10 text-accents rounded-lg hover:bg-accents/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Następna
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
