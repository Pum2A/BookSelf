// app/api/menu-items/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

interface JwtPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

export async function POST(request: Request) {
  // Pobranie tokena z ciasteczek
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Brak tokenu. Musisz być zalogowany." },
      { status: 401 }
    );
  }

  // Weryfikacja tokenu
  let payload: JwtPayload;
  try {
    const { payload: verifiedPayload } = await jwtVerify(token, secret);
    payload = verifiedPayload as unknown as JwtPayload;
  } catch (error) {
    return NextResponse.json(
      { message: "Nieprawidłowy lub wygasły token." },
      { status: 401 }
    );
  }

  // Tylko właściciel może dodawać usługi
  if (payload.role !== "OWNER") {
    return NextResponse.json(
      { message: "Brak uprawnień do dodawania usług." },
      { status: 403 }
    );
  }

  // Pobranie danych z body zapytania
  const { name, description, price, category, firmId } = await request.json();

  // Walidacja – sprawdź, czy wymagane pola są przekazane
  if (!name || !price || !category || !firmId) {
    return NextResponse.json(
      {
        message:
          "Wszystkie pola: name, price, category oraz firmId są wymagane.",
      },
      { status: 400 }
    );
  }

  // Sprawdź, czy firma należy do zalogowanego właściciela
  const firm = await prisma.firm.findUnique({
    where: { id: Number(firmId) },
    select: { ownerId: true },
  });

  if (!firm) {
    return NextResponse.json(
      { message: "Firma nie znaleziona." },
      { status: 404 }
    );
  }

  if (firm.ownerId !== payload.userId) {
    return NextResponse.json(
      { message: "Nie jesteś właścicielem tej firmy." },
      { status: 403 }
    );
  }

  try {
    // Dodanie usługi (MenuItem) do bazy
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: Number(price),
        category,
        firmId: Number(firmId),
      },
    });
    
    if(price > 1000) {
      return NextResponse.json(
        { message: "Cena nie może być większa niż 1000." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Usługa została dodana.", newMenuItem },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Błąd podczas dodawania usługi:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export {};
