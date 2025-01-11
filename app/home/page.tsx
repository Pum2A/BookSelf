"use client";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import {
  AiOutlineAppstore,
  AiOutlineClockCircle,
  AiOutlineSafety,
} from "react-icons/ai";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full text-white my-16 lg:my-16 px-4 mx-auto max-w-screen-xl">
      {/* Nagłówek */}
      <div className="flex flex-col text-center mb-12 mx-auto">
        <h1 className="text-5xl font-bold leading-tight">
          Discover and Book{" "}
          <span className="text-green-400">Your Favorites</span>
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-screen-sm mx-auto">
          Your one-stop solution for managing bookings, finding services, and
          keeping track of your favorites. Start exploring now and make your
          life easier!
        </p>
      </div>

      {/* Wyszukiwarka */}
      <div className="flex w-full max-w-lg bg-gray-700 shadow-md rounded-lg overflow-hidden mb-12 mx-auto">
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
      <div className="flex flex-col lg:flex-row items-center justify-between mt-16 w-full max-w-screen-xl gap-12 mx-auto">
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

      {/* Sekcja Testimonials (Opinie) */}
      <section className="mt-16 w-full max-w-screen-xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-8">What Our Users Say</h3>
        <div className="flex flex-wrap gap-8 justify-center">
          <div className="w-full md:w-1/3 text-center p-4 bg-gray-700 rounded-lg shadow-md">
            <p className="text-lg text-gray-400 mb-4">
              "This is the best app I’ve ever used! It makes booking so easy!"
            </p>
            <span className="text-lg text-green-400 font-semibold">
              John Doe
            </span>
          </div>
          <div className="w-full md:w-1/3 text-center p-4 bg-gray-700 rounded-lg shadow-md">
            <p className="text-lg text-gray-400 mb-4">
              "I love how intuitive and fast the booking process is!"
            </p>
            <span className="text-lg text-green-400 font-semibold">
              Jane Smith
            </span>
          </div>
        </div>
      </section>

      {/* Sekcja Features (Funkcje) */}
      <section className="mt-16 w-full max-w-screen-xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-8">Features</h3>
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          <div className="w-full lg:w-1/3 p-6 bg-gray-700 rounded-lg shadow-md text-center">
            <AiOutlineAppstore
              size={48}
              className="text-green-400 mb-4 mx-auto"
            />
            <h4 className="text-2xl font-semibold text-gray-300 mb-4">
              Easy to Use
            </h4>
            <p className="text-lg text-gray-400">
              Our app is intuitive and simple, making bookings a breeze.
            </p>
          </div>
          <div className="w-full lg:w-1/3 p-6 bg-gray-700 rounded-lg shadow-md text-center">
            <AiOutlineClockCircle
              size={48}
              className="text-green-400 mb-4 mx-auto"
            />
            <h4 className="text-2xl font-semibold text-gray-300 mb-4">
              Instant Booking
            </h4>
            <p className="text-lg text-gray-400">
              Book services or places in just a few clicks.
            </p>
          </div>
          <div className="w-full lg:w-1/3 p-6 bg-gray-700 rounded-lg shadow-md text-center">
            <AiOutlineSafety
              size={48}
              className="text-green-400 mb-4 mx-auto"
            />
            <h4 className="text-2xl font-semibold text-gray-300 mb-4">
              Secure Payments
            </h4>
            <p className="text-lg text-gray-400">
              Pay securely through our trusted payment system.
            </p>
          </div>
        </div>
      </section>

      {/* Sekcja FAQ */}
      <section className="mt-16 w-full max-w-screen-xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-8">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <details className="bg-gray-700 p-4 rounded-lg">
            <summary className="text-xl font-semibold text-gray-300">
              How can I book a service?
            </summary>
            <p className="text-lg text-gray-400">
              Simply search for the service or place you want to book and follow
              the prompts.
            </p>
          </details>
          <details className="bg-gray-700 p-4 rounded-lg">
            <summary className="text-xl font-semibold text-gray-300">
              Is my payment information secure?
            </summary>
            <p className="text-lg text-gray-400">
              Yes, we use SSL encryption and trusted payment processors to keep
              your information safe.
            </p>
          </details>
        </div>
      </section>

      {/* Call-to-Action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-green-400 text-gray-800 hover:bg-green-500 transition rounded-lg">
          Start Booking Now
        </button>
      </div>
    </main>
  );
}
