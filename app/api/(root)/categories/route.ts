// app/api/menu-items/categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.menuItem.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    return NextResponse.json({
      success: true,
      categories: categories.map((c) => c.category),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Błąd pobierania kategorii" },
      { status: 500 }
    );
  }
}
