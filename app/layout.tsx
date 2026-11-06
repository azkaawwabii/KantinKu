import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "KantinKu",
  description: "Pesan makanan dan minuman kantin dengan mudah",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Suspense
          fallback={
            <header className="navbar">
              <span className="logo">KantinKu</span>
            </header>
          }
        >
          <Navbar />
        </Suspense>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
