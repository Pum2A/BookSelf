// app/api/menu-items/[id]/route.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

// Helper do weryfikacji tokena
async function verifyToken(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    return { error: "Brak tokenu autoryzacyjnego", status: 401 };
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return { userId: Number(payload.userId), role: payload.role };
  } catch (error) {
    return { error: "Nieprawidłowy token", status: 401 };
  }
}

// Pobierz pojedynczą usługę
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Walidacja ID
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format ID" },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { firm: true },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Usługa nie znaleziona" },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Błąd serwera", details: error },
      { status: 500 }
    );
  }
}

// Aktualizuj usługę
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja autoryzacji
    const auth = await verifyToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Walidacja ID
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format ID" },
        { status: 400 }
      );
    }

    // Pobierz dane z body
    const { name, description, price, category } = await request.json();

    // Sprawdź właścicielstwo
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { firm: true },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Usługa nie znaleziona" },
        { status: 404 }
      );
    }

    if (menuItem.firm.ownerId !== auth.userId) {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
    }

    // Aktualizacja
    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        category,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Błąd serwera", details: error },
      { status: 500 }
    );
  }
}

// Usuń usługę
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja autoryzacji
    const auth = await verifyToken(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Walidacja ID
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Nieprawidłowy format ID" },
        { status: 400 }
      );
    }

    // Sprawdź właścicielstwo
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
      include: { firm: true },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Usługa nie znaleziona" },
        { status: 404 }
      );
    }

    if (menuItem.firm.ownerId !== auth.userId) {
      return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
    }

    // Usuwanie
    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Usługa została usunięta" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Błąd serwera", details: error },
      { status: 500 }
    );
  }
}
