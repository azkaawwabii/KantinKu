import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idAngka = /^\d+$/.test(id) ? Number(id) : NaN;
  const item = menu.find((m) => m.id === idAngka);

  if (!item) {
    return NextResponse.json(
      { pesan: "Menu tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(item);
}
