export type ItemKeranjang = { id: number; jumlah: number };

export type Pesanan = {
  id: number;
  nama: string;
  jumlah: number; // total item yang dipesan
  total: number;
  waktu: string; // ISO string
};

export function bacaData<T>(raw: string | null): T[] {
  try {
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export function snapshotStorage(kunci: string): string {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(kunci) ?? "[]";
}

export function langganiStorage(kunci: string, berubah: () => void) {
  const namaEvent = `${kunci}-berubah`;
  const perubahanLintasTab = (event: StorageEvent) => {
    if (event.key === kunci || event.key === null) berubah();
  };

  window.addEventListener(namaEvent, berubah);
  window.addEventListener("storage", perubahanLintasTab);
  return () => {
    window.removeEventListener(namaEvent, berubah);
    window.removeEventListener("storage", perubahanLintasTab);
  };
}

function baca<T>(kunci: string): T[] {
  if (typeof window === "undefined") return [];
  return bacaData<T>(window.localStorage.getItem(kunci));
}

// ---------- Keranjang ----------
export function bacaKeranjang(): ItemKeranjang[] {
  return baca<ItemKeranjang>("keranjang");
}

export function simpanKeranjang(items: ItemKeranjang[]) {
  window.localStorage.setItem("keranjang", JSON.stringify(items));
  // beri tahu Navbar agar lencana langsung berubah
  window.dispatchEvent(new Event("keranjang-berubah"));
}

// ---------- Favorit ----------
export function bacaFavorit(): number[] {
  return baca<number>("favorit");
}

export function simpanFavorit(ids: number[]) {
  window.localStorage.setItem("favorit", JSON.stringify(ids));
  window.dispatchEvent(new Event("favorit-berubah"));
}

// ---------- Riwayat ----------
export function bacaRiwayat(): Pesanan[] {
  return baca<Pesanan>("riwayat");
}

export function tambahRiwayat(pesanan: Pesanan) {
  const lama = bacaRiwayat();
  // terbaru di atas
  window.localStorage.setItem("riwayat", JSON.stringify([pesanan, ...lama]));
  window.dispatchEvent(new Event("riwayat-berubah"));
}

export function idPesananBaru() {
  return Date.now();
}
