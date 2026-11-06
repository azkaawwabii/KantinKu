import { Suspense } from "react";
import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import FormTambah from "@/components/FormTambah";
import TombolFavorit from "@/components/TombolFavorit";

// id yang dikenal dibuat saat build, id lain dirender saat diminta
export function generateStaticParams() {
  return menu.map((m) => ({ id: String(m.id) }));
}

async function DetailMenu({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idAngka = /^\d+$/.test(id) ? Number(id) : NaN;
  const item = menu.find((m) => m.id === idAngka);

  if (!item) notFound();

  return (
    <section className="detail">
      <h1>{item.nama}</h1>
      <p>Kategori: {item.kategori}</p>
      <p>Harga: {rupiah(item.harga)}</p>
      <p>Stok: {item.stok}</p>

      <TombolFavorit id={item.id} />

      {item.stok === 0 ? (
        <p className="habis-teks">Menu ini habis.</p>
      ) : (
        <FormTambah id={item.id} harga={item.harga} stok={item.stok} />
      )}
    </section>
  );
}

export default function DetailMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p>Memuat...</p>}>
      <DetailMenu params={params} />
    </Suspense>
  );
}
