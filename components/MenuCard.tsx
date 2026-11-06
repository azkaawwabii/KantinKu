import Link from "next/link";
import { type Menu, rupiah } from "@/data/menu";

export default function MenuCard({ item }: { item: Menu }) {
  const habis = item.stok === 0;

  return (
    <Link href={`/menu/${item.id}`} className="kartu">
      <h3>{item.nama}</h3>
      <p className="kategori">{item.kategori}</p>
      <p className="harga">{rupiah(item.harga)}</p>
      <p className={habis ? "stok habis" : "stok"}>
        {habis ? "Habis" : `Stok: ${item.stok}`}
      </p>
    </Link>
  );
}
