import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Pobieramy unikalne kategorie z tabeli MenuItem
    const items = await prisma.menuItem.findMany({
      distinct: ["category"],
      select: { category: true },
    });

    // Mapujemy wyniki do tablicy stringów
    const categories = items.map((item) => item.category).filter(Boolean);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Błąd pobierania kategorii" },
      { status: 500 }
    );
  }
}
