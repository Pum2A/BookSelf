import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Upewnij się, że import jest poprawny

// Funkcja obsługująca zapytanie GET dla pojedynczej firmy

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja parametru ID
    if (!params?.id) {
      return NextResponse.json({ error: "Brak parametru ID" }, { status: 400 });
    }

    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format ID" },
        { status: 400 }
      );
    }

    const firm = await prisma.firm.findUnique({
      where: { id },
      include: { menuItems: true },
    });

    if (!firm) {
      return NextResponse.json(
        { error: "Firma nie znaleziona" },
        { status: 404 }
      );
    }

    return NextResponse.json(firm);
  } catch (error) {
    return NextResponse.json(
      { error: "Błąd serwera", details: error },
      { status: 500 }
    );
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
