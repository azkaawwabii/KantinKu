"use client";

import { useEffect, useState } from "react";
import type { Menu } from "@/data/menu";
import MenuCard from "@/components/MenuCard";
import { bacaFavorit } from "@/lib/storage";

export default function FavoritPage() {
  const [status, setStatus] = useState<"memuat" | "galat" | "siap">("memuat");
  const [daftar, setDaftar] = useState<Menu[]>([]);

  useEffect(() => {
    let batal = false;

    async function muat() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Gagal");
        const data: Menu[] = await res.json();
        if (batal) return;

        const ids = bacaFavorit();
        setDaftar(data.filter((m) => ids.includes(m.id)));
        setStatus("siap");
      } catch {
        if (!batal) setStatus("galat");
      }
    }

    muat();
    return () => {
      batal = true;
    };
  }, []);

  return (
    <section>
      <h1>Favorit</h1>

      {status === "memuat" && <p>Memuat...</p>}
      {status === "galat" && (
        <p className="pesan-error">Gagal memuat data menu. Coba lagi nanti.</p>
      )}
      {status === "siap" && daftar.length === 0 && (
        <p>Belum ada menu favorit.</p>
      )}
      {status === "siap" && daftar.length > 0 && (
        <div className="grid">
          {daftar.map((m) => (
            <MenuCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </section>
  );
}
