import Link from "next/link";

export default function Beranda() {
  return (
    <section className="hero">
      <h1>Selamat datang di KantinKu</h1>
      <p>Lapar? Pesan makanan dan minuman favoritmu sekarang, tanpa antre!</p>
      <Link href="/menu" className="btn">
        Lihat Menu
      </Link>
    </section>
  );
}
