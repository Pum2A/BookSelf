import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma"; // Upewnij się, że import jest poprawny

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Brak parametru ID" }, { status: 400 });
    }

    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format ID" },
        { status: 400 }
      );
    }

    const firm = await prisma.firm.findUnique({
      where: { id: parsedId },
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Brak id w zapytaniu" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { name, description, location, address, openingHours } = body;

    if (!name || !description || !location || !address || !openingHours) {
      return NextResponse.json(
        { message: "Wszystkie pola są wymagane" },
        { status: 400 }
      );
    }

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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Brak id w zapytaniu" },
      { status: 400 }
    );
  }

  try {
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

export {};
