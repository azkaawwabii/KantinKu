"use client";

import { useMemo, useSyncExternalStore } from "react";
import { rupiah } from "@/data/menu";
import {
  bacaData,
  langganiStorage,
  snapshotStorage,
  type Pesanan,
} from "@/lib/storage";

const subscribeRiwayat = (berubah: () => void) =>
  langganiStorage("riwayat", berubah);
const getSnapshotRiwayat = () => snapshotStorage("riwayat");
const getServerSnapshotRiwayat = () => null;

export default function RiwayatPage() {
  const snapshot = useSyncExternalStore(
    subscribeRiwayat,
    getSnapshotRiwayat,
    getServerSnapshotRiwayat,
  );
  const daftar = useMemo(
    () =>
      bacaData<Pesanan>(snapshot).sort(
        (a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime(),
      ),
    [snapshot],
  );

  if (snapshot === null) return <p>Memuat...</p>;

  const totalBelanja = daftar.reduce((t, p) => t + p.total, 0);

  return (
    <section>
      <h1>Riwayat</h1>

      {daftar.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <>
          <p>
            <strong>
              {daftar.length} pesanan, total belanja {rupiah(totalBelanja)}
            </strong>
          </p>
          {daftar.map((p) => (
            <div className="kotak" key={p.id}>
              <p>
                <strong>{p.nama}</strong>
              </p>
              <p>Jumlah menu: {p.jumlah}</p>
              <p>Total: {rupiah(p.total)}</p>
              <p>Waktu: {new Date(p.waktu).toLocaleString("id-ID")}</p>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
