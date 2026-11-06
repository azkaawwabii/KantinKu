"use client";

import { useSyncExternalStore } from "react";
import {
  bacaFavorit,
  bacaData,
  langganiStorage,
  snapshotStorage,
  simpanFavorit,
} from "@/lib/storage";

const subscribeFavorit = (berubah: () => void) =>
  langganiStorage("favorit", berubah);
const getSnapshotFavorit = () => snapshotStorage("favorit");
const getServerSnapshotFavorit = () => null;

export default function TombolFavorit({ id }: { id: number }) {
  const snapshot = useSyncExternalStore(
    subscribeFavorit,
    getSnapshotFavorit,
    getServerSnapshotFavorit,
  );
  const favorit = bacaData<number>(snapshot).includes(id);

  const toggle = () => {
    const daftar = bacaFavorit();
    const baru = daftar.includes(id)
      ? daftar.filter((x) => x !== id)
      : [...daftar, id];
    simpanFavorit(baru);
  };

  return (
    <button type="button" className="btn btn-abu" onClick={toggle}>
      {favorit ? "♥ Favorit" : "♡ Tambah favorit"}
    </button>
  );
}
