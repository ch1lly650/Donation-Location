import type { Metadata } from "next";
import { Nunito, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import AdBanner from "@/components/AdBanner";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Donation Location",
  description:
    "Search verified nonprofits near you, filter by cause and distance, and give where it matters most.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ background: "#fbfcfe" }}>
        <AdBanner />
        <NavBar />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
