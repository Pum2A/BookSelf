import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "./(root)/contexts/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BookSelf",
  description: "BookSelf is a booking app for firms and people",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
