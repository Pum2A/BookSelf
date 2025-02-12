import { jwtVerify, JWTPayload } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

export async function GET(request: Request) {
  // Pobranie tokena z ciasteczek
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Brak tokenu. Musisz być zalogowany." },
      { status: 401 }
    );
  }

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

  // Tylko użytkownik z rolą 'owner' ma dostęp do firm
  if (payload.role !== "OWNER") {
    return NextResponse.json(
      { message: "Brak uprawnień do przeglądania firm." },
      { status: 403 }
    );
  }

  // Pobranie firm należących do zalogowanego właściciela
  const firms = await prisma.firm.findMany({
    where: { ownerId: payload.userId },
  });

  return NextResponse.json(firms, { status: 200 });
}

export async function POST(request: Request) {
  try {
    // Pobierz ciasteczka
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    console.log("Token z ciasteczek:", token);

    // Sprawdź, czy token istnieje
    if (!token) {
      console.error("Brak tokenu.");
      return NextResponse.json(
        { message: "Brak tokenu. Musisz być zalogowany." },
        { status: 401 }
      );
    }

    // Zweryfikuj token JWT
    let payload: JwtPayload | null = null;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload as unknown as JwtPayload;

      console.log("Zweryfikowany payload:", payload);

      // Sprawdzamy, czy payload zawiera wymagane dane
      if (!payload || !payload.userId || !payload.role) {
        throw new Error("Token nie zawiera wymaganych danych.");
      }
    } catch (err) {
      console.error("Błąd weryfikacji tokenu:", err);
      return NextResponse.json(
        { message: "Nieprawidłowy lub wygasły token." },
        { status: 401 }
      );
    }

    // Pobierz dane firmy z body zapytania
    const { name, description, location, address, openingHours } =
      await request.json();

    console.log("Dane firmy:", {
      name,
      description,
      location,
      address,
      openingHours,
    });

    // Sprawdzenie, czy wszystkie dane są przekazane
    if (!name || !description || !location || !address || !openingHours) {
      console.error("Brak danych firmy.");
      return NextResponse.json(
        { message: "Wszystkie pola są wymagane!" },
        { status: 400 }
      );
    }

    // Tworzenie firmy w bazie danych
    const newFirm = await prisma.firm.create({
      data: {
        name,
        description,
        location,
        address,
        openingHours,
        ownerId: payload.userId, // Teraz TypeScript wie, że userId to number
      },
    });

    console.log("Firma utworzona:", newFirm);

    // Zwróć odpowiedź po udanym tworzeniu firmy
    return NextResponse.json(
      { message: "Firma utworzona", firm: newFirm },
      { status: 201 }
    );
  } catch (error: any) {
    // Improved error logging to avoid logging null
    if (error instanceof Error) {
      console.error(
        "Błąd podczas tworzenia firmy:",
        error.stack || error.message
      );
    } else {
      console.error("Nieoczekiwany błąd:", error);
    }

    return NextResponse.json(
      {
        message: "Nie udało się utworzyć firmy",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
