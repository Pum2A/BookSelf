"use client";
import Image from "next/image";
import {
  AiOutlineInfoCircle,
  AiOutlineTeam,
  AiOutlineSafety,
} from "react-icons/ai";

export default function About() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full text-white my-16 lg:my-16 px-4 mx-auto max-w-screen-xl">
      {/* Header */}
      <div className="flex flex-col text-center mb-12 mx-auto">
        <h1 className="text-5xl font-bold leading-tight">
          About <span className="text-green-400">BookSelf</span>
        </h1>
        <p className="text-lg text-gray-400 mt-4 max-w-screen-sm mx-auto">
          Discover how BookSelf can transform your booking experience and make
          your life easier.
        </p>
      </div>

      {/* About Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between mt-16 w-full max-w-screen-xl gap-12 mx-auto">
        {/* Left Image */}
        <div className="w-full lg:w-1/3">
          <Image
            src="/bookAbout.svg" // Example image path
            alt="About BookSelf"
            width={300} // Smaller size
            height={300} // Adjusted height
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Text */}
        <div className="w-full lg:w-2/3 text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4">
            Empowering Your Booking Experience
          </h2>
          <p className="text-lg text-gray-400 mb-6 leading-relaxed">
            BookSelf is designed to simplify your life by offering a seamless
            and intuitive platform for booking a wide range of services. Whether
            you're booking your next stay, event, or an appointment, we make it
            quick and secure.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            We strive to provide the most user-friendly booking experience for
            individuals and businesses alike. Join our growing community of
            users today!
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section className="mt-16 w-full max-w-screen-xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-8">Why Choose Us?</h3>
        <div className="flex flex-col lg:flex-row justify-center gap-8">
          <div className="w-full lg:w-1/3 p-6 bg-gray-700 rounded-lg shadow-md text-center">
            <AiOutlineInfoCircle
              size={48}
              className="text-green-400 mb-4 mx-auto"
            />
            <h4 className="text-2xl font-semibold text-gray-300 mb-4">
              Reliable Information
            </h4>
            <p className="text-lg text-gray-400">
              Our platform ensures that you always have access to up-to-date and
              accurate information for your bookings.
            </p>
          </div>
          <div className="w-full lg:w-1/3 p-6 bg-gray-700 rounded-lg shadow-md text-center">
            <AiOutlineTeam size={48} className="text-green-400 mb-4 mx-auto" />
            <h4 className="text-2xl font-semibold text-gray-300 mb-4">
              Dedicated Team
            </h4>
            <p className="text-lg text-gray-400">
              Our support team is always ready to assist with any inquiries or
              issues you may face during your booking journey.
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

      {/* Call-to-Action Button */}
      <div className="mt-12 text-center">
        <button className="px-8 py-3 bg-green-400 text-gray-800 hover:bg-green-500 transition rounded-lg">
          Get Started Today
        </button>
      </div>
    </main>
  );
}
