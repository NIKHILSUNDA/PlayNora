import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChromeGate from "@/components/ChromeGate";
import { BookingProvider } from "@/context/BookingContext";
import { AuthProvider } from "@/context/AuthContext";
import { ContactProvider } from "@/context/ContactContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], style: "italic", weight: ["600", "700"], variable: "--font-playfair" });
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1a0b2e" };
export const metadata: Metadata = { title: "PlayNora – Your Game. Your People.", description: "Book sports venues, find games and join a community." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
        <BookingProvider>
          <ContactProvider>
          <ChromeGate><Navbar /></ChromeGate>
          <main>{children}</main>
          <ChromeGate><Footer /></ChromeGate>
        </ContactProvider>
        </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
