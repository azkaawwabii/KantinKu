export type Menu = {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

export const menu: Menu[] = [
  {
    id: 1,
    nama: "Nasi Goreng Spesial",
    kategori: "Makanan",
    harga: 12000,
    stok: 15,
  },
  { id: 2, nama: "Mie Ayam", kategori: "Makanan", harga: 10000, stok: 8 },
  { id: 3, nama: "Es Teh Manis", kategori: "Minuman", harga: 3000, stok: 40 },
  { id: 4, nama: "Jus Alpukat", kategori: "Minuman", harga: 8000, stok: 0 },
  { id: 5, nama: "Pisang Goreng", kategori: "Camilan", harga: 5000, stok: 20 },
  { id: 6, nama: "Risol Mayo", kategori: "Camilan", harga: 4000, stok: 3 },
];

export function rupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
