import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Upewnij się, że import jest poprawny

// Funkcja obsługująca zapytanie GET dla pojedynczej firmy
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Brak id w zapytaniu" },
      { status: 400 }
    );
  }

  try {
    // Wyszukiwanie firmy w bazie danych
    const firm = await prisma.firm.findUnique({
      where: { id: Number(id) }, // Konwertujemy id na liczbę
    });

    if (!firm) {
      return NextResponse.json(
        { message: "Firma nie znaleziona" },
        { status: 404 }
      );
    }

    // Zwracamy firmę, jeśli została znaleziona
    return NextResponse.json(firm, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas pobierania firmy:", error);
    return NextResponse.json({ message: "Błąd serwera" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Brak id w zapytaniu" },
      { status: 400 }
    );
  }

  try {
    // Pobranie danych z body zapytania
    const body = await request.json();
    const { name, description, location, address, openingHours } = body;

    // Sprawdzenie, czy wszystkie pola zostały przekazane
    if (!name || !description || !location || !address || !openingHours) {
      return NextResponse.json(
        { message: "Wszystkie pola są wymagane" },
        { status: 400 }
      );
    }

    // Aktualizacja firmy w bazie danych
    const updatedFirm = await prisma.firm.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        location,
        address,
        openingHours,
      },
    });

    return NextResponse.json(
      { message: "Firma zaktualizowana", firm: updatedFirm },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Błąd podczas aktualizacji firmy:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Brak id w zapytaniu" },
      { status: 400 }
    );
  }

  try {
    // Usunięcie firmy z bazy danych
    const deletedFirm = await prisma.firm.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Firma została usunięta", firm: deletedFirm },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Błąd podczas usuwania firmy:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
