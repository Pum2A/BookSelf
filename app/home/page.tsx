"use client";
import Image from "next/image";

import { AiOutlineSearch } from "react-icons/ai";
export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-800 text-white px-4">
      {/* Nagłówek */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold leading-tight">
          Discover and Book{" "}
          <span className="text-green-400">Your Favorites</span>
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-xl">
          Your one-stop solution for managing bookings, finding services, and
          keeping track of your favorites. Start exploring now and make your
          life easier!
        </p>
      </div>

      {/* Wyszukiwarka */}
      <div className="flex items-center w-full max-w-lg bg-gray-700 shadow-md rounded-lg overflow-hidden">
        <input
          type="text"
          className="flex-grow px-4 py-3 text-gray-300 bg-transparent placeholder-gray-500 outline-none"
          placeholder="Search for services or places..."
        />
        <button className="px-4 py-3 bg-green-400 text-gray-800 hover:bg-green-500 transition">
          <AiOutlineSearch size={24} />
        </button>
      </div>

      {/* Sekcja zachęcająca */}
      <div className="flex flex-col lg:flex-row items-center justify-between mt-16 w-full max-w-5xl gap-12">
        {/* Obrazek z lewej */}
        <div className="w-full lg:w-1/2">
          <Image
            src="/imageMain.png" // Ścieżka do obrazka
            alt="Booking Illustration"
            width={600} // Podaj szerokość
            height={400} // Podaj wysokość
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Tekst z prawej */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose <span className="text-green-400">BookSelf?</span>
          </h2>
          <p className="text-lg text-gray-400 mb-6 leading-relaxed">
            BookSelf makes it simple to find and book the best services, whether
            it’s a cozy coffee shop, an exciting event, or your next vacation
            spot. Save time, stay organized, and enjoy a seamless booking
            experience.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Join thousands of satisfied users and make every moment count.
          </p>
        </div>
      </div>
    </main>
  );
}
