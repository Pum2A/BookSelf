import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Upewnij się, że import jest poprawny

// Funkcja obsługująca zapytanie GET dla pojedynczej firmy
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Brak id w zapytaniu" }, { status: 400 });
  }

  try {
    // Wyszukiwanie firmy w bazie danych
    const firm = await prisma.firm.findUnique({
      where: { id: Number(id) }, // Konwertujemy id na liczbę
    });

    if (!firm) {
      return NextResponse.json({ message: "Firma nie znaleziona" }, { status: 404 });
    }

    // Zwracamy firmę, jeśli została znaleziona
    return NextResponse.json(firm, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas pobierania firmy:", error);
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}
