import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { getLang } from "@/lib/getLang";

export const metadata: Metadata = {
  title: "CineVerse — Discover Movies",
  description: "Discover movies, watch trailers, and find where to stream them.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();

  return (
    <html lang={lang}>
      <body style={{ background: "#141414", color: "#e5e5e5" }}>
        <LanguageProvider lang={lang}>
          <Navbar />
          <main>{children}</main>
          <Footer lang={lang} />
        </LanguageProvider>
      </body>
    </html>
  );
}
