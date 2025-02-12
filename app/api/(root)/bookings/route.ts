// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { message: "Brak tokenu. Musisz być zalogowany." },
      { status: 401 }
    );
  }

  let payload: any;
  try {
    const { payload: verifiedPayload } = await jwtVerify(token, secret);
    payload = verifiedPayload;
  } catch (error) {
    return NextResponse.json(
      { message: "Nieprawidłowy lub wygasły token." },
      { status: 401 }
    );
  }

  if (payload.role !== "CUSTOMER") {
    return NextResponse.json(
      { message: "Brak uprawnień do tworzenia rezerwacji." },
      { status: 403 }
    );
  }

  const { bookingTime, numberOfPeople, firmId, menuItemId } =
    await request.json();
  if (!bookingTime || !numberOfPeople || !firmId) {
    return NextResponse.json(
      { message: "Wymagane są pola: bookingTime, numberOfPeople oraz firmId" },
      { status: 400 }
    );
  }

  // Przykładowa walidacja w endpointzie POST rezerwacji
  const existingBooking = await prisma.booking.findFirst({
    where: {
      firmId: Number(firmId),
      bookingTime: new Date(bookingTime), // Upewnij się, że porównujesz w odpowiednim formacie
    },
  });

  if (existingBooking) {
    return NextResponse.json(
      { message: "Wybrany slot czasowy jest już zajęty. Wybierz inny." },
      { status: 409 }
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        bookingTime: new Date(bookingTime),
        numberOfPeople: Number(numberOfPeople),
        customerId: payload.userId,
        firmId: Number(firmId),
        menuItemId: menuItemId ? Number(menuItemId) : null, // przypisujemy usługę, jeśli została wybrana
      },
    });

    return NextResponse.json(
      { message: "Rezerwacja utworzona", booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Błąd podczas tworzenia rezerwacji:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
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

  let payload: any;
  try {
    const { payload: verifiedPayload } = await jwtVerify(token, secret);
    payload = verifiedPayload;
  } catch (error) {
    return NextResponse.json(
      { message: "Nieprawidłowy lub wygasły token." },
      { status: 401 }
    );
  }

  if (payload.role !== "CUSTOMER") {
    return NextResponse.json(
      { message: "Brak uprawnień do przeglądania rezerwacji." },
      { status: 403 }
    );
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        customerId: payload.userId,
      },
      include: {
        firm: {
          select: { id: true, name: true },
        },
        menuItem: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        bookingTime: "asc", // Sortowanie od najbliższej rezerwacji
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error("Błąd pobierania rezerwacji:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
