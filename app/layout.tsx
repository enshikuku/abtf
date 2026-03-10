import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agri-Business Trade Fair - University of Eldoret",
  description:
    "University of Eldoret Agri-Business Trade Fair - Transforming Agriculture Through Innovation",
  icons: {
    icon: [
      { url: "/branding/favicon/favicon.ico", sizes: "any" },
      { url: "/branding/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/branding/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/branding/favicon/apple-touch-icon.png",
  },
  manifest: "/branding/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-inter text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
