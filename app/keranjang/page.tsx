"use client";

import {
  useMemo,
  useSyncExternalStore,
  useState,
  type FormEvent,
} from "react";
import { menu, rupiah } from "@/data/menu";
import {
  bacaData,
  idPesananBaru,
  langganiStorage,
  snapshotStorage,
  simpanKeranjang,
  tambahRiwayat,
  type ItemKeranjang,
} from "@/lib/storage";

const MIN_PROMO = 20000;
const ONGKIR = 2000;

type Struk = {
  nama: string;
  baris: { nama: string; jumlah: number; subtotal: number }[];
  subtotal: number;
  diskon: number;
  antar: boolean;
  kelas: string;
  ongkir: number;
  total: number;
};

function hitungSubtotal(list: ItemKeranjang[]) {
  return list.reduce((t, it) => {
    const m = menu.find((x) => x.id === it.id);
    return t + (m ? m.harga * it.jumlah : 0);
  }, 0);
}

const subscribeKeranjang = (berubah: () => void) =>
  langganiStorage("keranjang", berubah);
const getSnapshotKeranjang = () => snapshotStorage("keranjang");
const getServerSnapshotKeranjang = () => null;

export default function KeranjangPage() {
  const snapshot = useSyncExternalStore(
    subscribeKeranjang,
    getSnapshotKeranjang,
    getServerSnapshotKeranjang,
  );
  const items = useMemo(
    () => bacaData<ItemKeranjang>(snapshot),
    [snapshot],
  );

  // promo
  const [kodeInput, setKodeInput] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [promoPesan, setPromoPesan] = useState<{
    ok: boolean;
    teks: string;
  } | null>(null);

  // cara ambil
  const [antar, setAntar] = useState(false);
  const [kelas, setKelas] = useState("");

  // pemesan
  const [nama, setNama] = useState("");
  const [errNama, setErrNama] = useState("");
  const [errKelas, setErrKelas] = useState("");

  const [struk, setStruk] = useState<Struk | null>(null);

  // ---------- Perhitungan ----------
  const baris = items.flatMap((it) => {
    const m = menu.find((x) => x.id === it.id);
    return m ? [{ menu: m, jumlah: it.jumlah }] : [];
  });

  const subtotal = baris.reduce((t, b) => t + b.menu.harga * b.jumlah, 0);
  const diskon =
    promoAktif && subtotal >= MIN_PROMO ? Math.round(subtotal * 0.1) : 0;
  const ongkir = antar ? ONGKIR : 0;
  const total = subtotal - diskon + ongkir;

  // ---------- Aksi keranjang ----------
  const perbarui = (baru: ItemKeranjang[]) => {
    simpanKeranjang(baru);

    // diskon otomatis tidak berlaku bila subtotal turun di bawah minimal
    if (promoAktif && hitungSubtotal(baru) < MIN_PROMO) {
      setPromoAktif(false);
      setPromoPesan({
        ok: false,
        teks: "Promo HEMAT10 butuh belanja minimal Rp 20.000.",
      });
    }
  };

  const ubahJumlah = (id: number, delta: number) => {
    const m = menu.find((x) => x.id === id);
    if (!m) return;

    const baru = items.map((it) => {
      if (it.id !== id) return it;
      const jumlahBaru = it.jumlah + delta;
      if (jumlahBaru < 1 || jumlahBaru > m.stok) return it;
      return { ...it, jumlah: jumlahBaru };
    });
    perbarui(baru);
  };

  const hapus = (id: number) => {
    perbarui(items.filter((it) => it.id !== id));
  };

  // ---------- Promo ----------
  const pakaiPromo = () => {
    const kode = kodeInput.trim().toUpperCase();

    if (kode !== "HEMAT10") {
      setPromoAktif(false);
      setPromoPesan({ ok: false, teks: "Kode promo tidak dikenal." });
      return;
    }
    if (subtotal < MIN_PROMO) {
      setPromoAktif(false);
      setPromoPesan({
        ok: false,
        teks: "Promo HEMAT10 butuh belanja minimal Rp 20.000.",
      });
      return;
    }
    setPromoAktif(true);
    setPromoPesan({ ok: true, teks: "Promo HEMAT10 dipakai: diskon 10%." });
  };

  // ---------- Pesan ----------
  const pesan = (e: FormEvent) => {
    e.preventDefault();

    let salah = false;
    if (nama.trim().length < 3) {
      setErrNama("Nama pemesan minimal 3 huruf.");
      salah = true;
    } else {
      setErrNama("");
    }

    if (antar && kelas.trim().length < 3) {
      setErrKelas("Kelas wajib diisi (minimal 3 karakter).");
      salah = true;
    } else {
      setErrKelas("");
    }

    if (salah || baris.length === 0) return;

    const hasil: Struk = {
      nama: nama.trim(),
      baris: baris.map((b) => ({
        nama: b.menu.nama,
        jumlah: b.jumlah,
        subtotal: b.menu.harga * b.jumlah,
      })),
      subtotal,
      diskon,
      antar,
      kelas: kelas.trim(),
      ongkir,
      total,
    };

    tambahRiwayat({
      id: idPesananBaru(),
      nama: hasil.nama,
      jumlah: baris.reduce((t, b) => t + b.jumlah, 0),
      total,
      waktu: new Date().toISOString(),
    });

    setStruk(hasil);

    // kosongkan keranjang, reset formulir dan promo
    simpanKeranjang([]);
    setKodeInput("");
    setPromoAktif(false);
    setPromoPesan(null);
    setAntar(false);
    setKelas("");
    setNama("");
    setErrNama("");
    setErrKelas("");
  };

  if (snapshot === null) return <p>Memuat...</p>;

  return (
    <section>
      <h1>Keranjang</h1>

      {baris.length === 0 && !struk && <p>Keranjang masih kosong.</p>}

      {baris.length > 0 && (
        <>
          {baris.map((b) => (
            <div className="baris" key={b.menu.id}>
              <div>
                <strong>{b.menu.nama}</strong>
                <div>{rupiah(b.menu.harga)}</div>
              </div>

              <div className="qty">
                <button
                  className="btn btn-abu btn-kecil"
                  onClick={() => ubahJumlah(b.menu.id, -1)}
                  disabled={b.jumlah <= 1}
                >
                  -
                </button>
                <span>{b.jumlah}</span>
                <button
                  className="btn btn-abu btn-kecil"
                  onClick={() => ubahJumlah(b.menu.id, 1)}
                  disabled={b.jumlah >= b.menu.stok}
                >
                  +
                </button>
              </div>

              <div>{rupiah(b.menu.harga * b.jumlah)}</div>

              <button
                className="btn btn-bahaya btn-kecil"
                onClick={() => hapus(b.menu.id)}
              >
                Hapus
              </button>
            </div>
          ))}

          {/* Kode promo */}
          <div className="promo">
            <input
              type="text"
              placeholder="Kode promo"
              value={kodeInput}
              onChange={(e) => setKodeInput(e.target.value)}
            />
            <button type="button" className="btn" onClick={pakaiPromo}>
              Pakai
            </button>
          </div>
          {promoPesan && (
            <p className={promoPesan.ok ? "pesan-ok" : "pesan-error"}>
              {promoPesan.teks}
            </p>
          )}

          {/* Cara ambil */}
          <div className="radio-grup">
            <strong>Cara ambil</strong>
            <label>
              <input
                type="radio"
                name="cara"
                checked={!antar}
                onChange={() => {
                  setAntar(false);
                  setErrKelas("");
                }}
              />{" "}
              Ambil sendiri
            </label>
            <label>
              <input
                type="radio"
                name="cara"
                checked={antar}
                onChange={() => setAntar(true)}
              />{" "}
              Diantar (+Rp 2.000)
            </label>
          </div>

          {/* Ringkasan */}
          <div className="ringkasan">
            <div>
              <span>Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            {diskon > 0 && (
              <div>
                <span>Diskon</span>
                <span>-{rupiah(diskon)}</span>
              </div>
            )}
            {antar && (
              <div>
                <span>Ongkir</span>
                <span>{rupiah(ongkir)}</span>
              </div>
            )}
            <div className="total">
              <span>Total</span>
              <span>{rupiah(total)}</span>
            </div>
          </div>

          {/* Formulir pesan */}
          <form className="form" onSubmit={pesan}>
            <label htmlFor="nama">Nama pemesan</label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
            {errNama && <p className="pesan-error">{errNama}</p>}

            {antar && (
              <>
                <label htmlFor="kelas">Kelas</label>
                <input
                  id="kelas"
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                />
                {errKelas && <p className="pesan-error">{errKelas}</p>}
              </>
            )}

            <button type="submit" className="btn">
              Pesan sekarang
            </button>
          </form>
        </>
      )}

      {/* Struk */}
      {struk && (
        <div className="struk">
          <h2>Terima kasih, {struk.nama}!</h2>
          {struk.baris.map((b, i) => (
            <p key={i}>
              {b.nama} x{b.jumlah} = {rupiah(b.subtotal)}
            </p>
          ))}
          <p>Subtotal: {rupiah(struk.subtotal)}</p>
          {struk.diskon > 0 && <p>Diskon: -{rupiah(struk.diskon)}</p>}
          <p>
            {struk.antar
              ? `Ongkir antar ke ${struk.kelas}: ${rupiah(struk.ongkir)}`
              : "Diambil sendiri di kantin"}
          </p>
          <p>
            <strong>Total bayar: {rupiah(struk.total)}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
