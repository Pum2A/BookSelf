import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";

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

  let firms;
  if (payload.role === "OWNER") {
    // OWNER widzi tylko swoje firmy
    firms = await prisma.firm.findMany({
      where: { ownerId: payload.userId },
      include: { menuItems: true },
    });
  } else {
    // CUSTOMER i ADMIN widzą wszystkie firmy
    firms = await prisma.firm.findMany({
      include: { menuItems: true },
    });
  }

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

    // Parse the FormData from the request
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const address = formData.get("address") as string;
    const openingHours = formData.get("openingHours") as string;
    const image = formData.get("image") as File | null;

    console.log("Dane firmy:", {
      name,
      description,
      location,
      address,
      openingHours,
      image: image ? "Plik obrazu" : "Brak obrazu",
    });

    // Sprawdzenie, czy wszystkie dane są przekazane
    if (!name || !description || !location || !address || !openingHours) {
      console.error("Brak danych firmy.");
      return NextResponse.json(
        { message: "Wszystkie pola są wymagane!" },
        { status: 400 }
      );
    }

    let imagePath = null;

    // Handle image upload if image exists
    if (image && image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename with timestamp and random string
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 12);
      const fileExtension = image.name.split(".").pop();
      const fileName = `firm_${timestamp}_${randomString}.${fileExtension}`;

      // Create directory for firm images if it doesn't exist
      const uploadsDir = join(process.cwd(), "public", "uploads", "firms");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Set path for storing the image and save it
      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      // Set the path that will be stored in the database
      imagePath = `/uploads/firms/${fileName}`;
    }

    // Tworzenie firmy w bazie danych
    const newFirm = await prisma.firm.create({
      data: {
        name,
        description,
        location,
        address,
        openingHours,
        imagePath, // Add the image path to the database
        ownerId: payload.userId,
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
