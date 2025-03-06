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

  // Przykładowa walidacja w endpointcie POST rezerwacji
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

  if (payload.role === "OWNER") {
    return NextResponse.json(
      { message: "Właściciel nie ma dostępu do rezerwacji" },
      { status: 403 }
    );
  }

  if (payload.role !== "CUSTOMER" && payload.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Brak uprawnień do przeglądania rezerwacji." },
      { status: 403 }
    );
  }

  try {
    // Jeśli użytkownik jest klientem, zwróć tylko jego rezerwacje
    // Jeśli jest adminem, może zobaczyć wszystkie rezerwacje
    const where =
      payload.role === "CUSTOMER" ? { customerId: payload.userId } : {};

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        firm: {
          select: { id: true, name: true },
        },
        menuItem: {
          select: { id: true, name: true },
        },
        customer: {
          select: { id: true, username: true, email: true },
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

// Dodajemy metodę DELETE do anulowania rezerwacji
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("id");

  if (!bookingId) {
    return NextResponse.json(
      { message: "Brak identyfikatora rezerwacji" },
      { status: 400 }
    );
  }

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

  if (payload.role === "OWNER") {
    return NextResponse.json(
      { message: "Właściciel nie ma dostępu do rezerwacji" },
      { status: 403 }
    );
  }

  try {
    // Najpierw sprawdzamy, czy rezerwacja istnieje
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Rezerwacja nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdzamy, czy użytkownik ma uprawnienia do usunięcia tej rezerwacji
    // CUSTOMER może usunąć tylko swoje rezerwacje, ADMIN może usunąć dowolną
    if (payload.role === "CUSTOMER" && booking.customerId !== payload.userId) {
      return NextResponse.json(
        { message: "Nie masz uprawnień do anulowania tej rezerwacji" },
        { status: 403 }
      );
    }

    // Usuwamy rezerwację
    await prisma.booking.delete({
      where: { id: Number(bookingId) },
    });

    return NextResponse.json(
      { message: "Rezerwacja anulowana pomyślnie" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Błąd podczas anulowania rezerwacji:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// Dodajemy metodę PUT do aktualizacji rezerwacji
export async function PUT(request: Request) {
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

  if (payload.role === "OWNER") {
    return NextResponse.json(
      { message: "Właściciel nie ma dostępu do rezerwacji" },
      { status: 403 }
    );
  }

  if (payload.role !== "CUSTOMER" && payload.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Brak uprawnień do aktualizacji rezerwacji." },
      { status: 403 }
    );
  }

  const { id, bookingTime, numberOfPeople, menuItemId } = await request.json();

  if (!id) {
    return NextResponse.json(
      { message: "Brak identyfikatora rezerwacji" },
      { status: 400 }
    );
  }

  try {
    // Sprawdzamy, czy rezerwacja istnieje
    const existingBooking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { message: "Rezerwacja nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdzamy, czy użytkownik ma uprawnienia do aktualizacji tej rezerwacji
    if (
      payload.role === "CUSTOMER" &&
      existingBooking.customerId !== payload.userId
    ) {
      return NextResponse.json(
        { message: "Nie masz uprawnień do aktualizacji tej rezerwacji" },
        { status: 403 }
      );
    }

    // Przygotowujemy dane do aktualizacji
    const updateData: any = {};

    if (bookingTime) updateData.bookingTime = new Date(bookingTime);
    if (numberOfPeople) updateData.numberOfPeople = Number(numberOfPeople);
    if (menuItemId !== undefined)
      updateData.menuItemId = menuItemId ? Number(menuItemId) : null;

    // Aktualizujemy rezerwację
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(
      { message: "Rezerwacja zaktualizowana", booking: updatedBooking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Błąd podczas aktualizacji rezerwacji:", error);
    return NextResponse.json(
      { message: "Błąd serwera", error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export {};
