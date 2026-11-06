"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { bacaKeranjang } from "@/lib/storage";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/favorit", label: "Favorit" },
  { href: "/keranjang", label: "Keranjang" },
  { href: "/riwayat", label: "Riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    const hitung = () => {
      const total = bacaKeranjang().reduce((t, item) => t + item.jumlah, 0);
      setJumlah(total);
    };

    hitung();
    window.addEventListener("keranjang-berubah", hitung);
    return () => window.removeEventListener("keranjang-berubah", hitung);
  }, []);

  const aktif = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="navbar">
      <span className="logo">KantinKu</span>
      <nav>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={aktif(l.href) ? "nav-link aktif" : "nav-link"}
          >
            {l.href === "/keranjang" && jumlah > 0
              ? `${l.label} (${jumlah})`
              : l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
