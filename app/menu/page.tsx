"use client";

import { useMemo, useState } from "react";
import { menu } from "@/data/menu";
import MenuCard from "@/components/MenuCard";

const daftarKategori = ["Semua", "Makanan", "Minuman", "Camilan"];

export default function KatalogPage() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("awal");

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();

    const disaring = menu.filter(
      (m) =>
        (kategori === "Semua" || m.kategori === kategori) &&
        m.nama.toLowerCase().includes(kata),
    );

    const salinan = [...disaring];
    if (urut === "termurah") salinan.sort((a, b) => a.harga - b.harga);
    else if (urut === "termahal") salinan.sort((a, b) => b.harga - a.harga);
    else if (urut === "nama")
      salinan.sort((a, b) => a.nama.localeCompare(b.nama, "id"));

    return salinan;
  }, [cari, kategori, urut]);

  return (
    <section>
      <h1>Menu</h1>

      <div className="filter">
        <input
          type="text"
          placeholder="Cari menu..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
        />
        <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
          {daftarKategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <select value={urut} onChange={(e) => setUrut(e.target.value)}>
          <option value="awal">Urutan awal</option>
          <option value="termurah">Harga termurah</option>
          <option value="termahal">Harga termahal</option>
          <option value="nama">Nama A–Z</option>
        </select>
      </div>

      {hasil.length === 0 ? (
        <p>Menu tidak ditemukan.</p>
      ) : (
        <div className="grid">
          {hasil.map((m) => (
            <MenuCard key={m.id} item={m} />
          ))}
        </div>
      )}
    </section>
  );
}
