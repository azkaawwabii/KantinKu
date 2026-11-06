"use client";

import { useState, type FormEvent } from "react";
import { rupiah } from "@/data/menu";
import { bacaKeranjang, simpanKeranjang } from "@/lib/storage";

type Props = { id: number; harga: number; stok: number };

export default function FormTambah({ id, harga, stok }: Props) {
  const [jumlahTeks, setJumlahTeks] = useState("1");
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");

  const jumlah = Number(jumlahTeks);
  const valid =
    jumlahTeks.trim() !== "" && Number.isInteger(jumlah) && jumlah >= 1;
  const total = valid ? harga * jumlah : 0;

  const ubah = (nilai: string) => {
    setJumlahTeks(nilai);
    setError("");
    setSukses("");
  };

  const kirim = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSukses("");

    if (!valid) {
      setError("Jumlah minimal 1 dan harus berupa bilangan bulat.");
      return;
    }

    const keranjang = bacaKeranjang();
    const sudahAda = keranjang.find((it) => it.id === id);
    const sudahJumlah = sudahAda ? sudahAda.jumlah : 0;

    if (jumlah + sudahJumlah > stok) {
      setError(
        `Jumlah melebihi stok. Stok ${stok}, sudah ada di keranjang ${sudahJumlah}, ` +
          `jadi maksimal yang bisa ditambah ${Math.max(stok - sudahJumlah, 0)}.`,
      );
      return;
    }

    const baru = sudahAda
      ? keranjang.map((it) =>
          it.id === id ? { ...it, jumlah: it.jumlah + jumlah } : it,
        )
      : [...keranjang, { id, jumlah }];

    simpanKeranjang(baru);
    setSukses("Ditambahkan ke keranjang.");
  };

  return (
    <form className="form" onSubmit={kirim}>
      <label htmlFor="jumlah">Jumlah</label>
      <input
        id="jumlah"
        type="number"
        value={jumlahTeks}
        onChange={(e) => ubah(e.target.value)}
      />
      <p>
        <strong>Total harga: {rupiah(total)}</strong>
      </p>
      <button type="submit" className="btn">
        Tambah ke keranjang
      </button>
      {error && <p className="pesan-error">{error}</p>}
      {sukses && <p className="pesan-ok">{sukses}</p>}
    </form>
  );
}
