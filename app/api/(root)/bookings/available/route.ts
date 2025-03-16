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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firmId = searchParams.get("firmId");
  const date = searchParams.get("date");

  if (!firmId || !date) {
    return NextResponse.json(
      { message: "Brak firmId lub date w zapytaniu" },
      { status: 400 }
    );
  }

  // Sprawdzenie, czy data nie jest w przeszłości (porównujemy tylko datę)
  const requestDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (requestDate < today) {
    return NextResponse.json(
      { message: "Nie można dokonać rezerwacji na przeszłe daty." },
      { status: 400 }
    );
  }

  // Weryfikacja tokenu
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
      { message: "Token nieprawidłowy lub wygasły." },
      { status: 401 }
    );
  }

  // Pobieramy godzin otwarcia firmy ustawione przez właściciela
  const firm = await prisma.firm.findUnique({
    where: { id: Number(firmId) },
    select: { openingHours: true },
  });

  if (!firm || !firm.openingHours) {
    return NextResponse.json(
      { message: "Nie znaleziono firmy lub brak ustawionych godzin otwarcia." },
      { status: 400 }
    );
  }

  // Oczekujemy, że openingHours ma format "HH:MM-HH:MM", np. "08:00-16:00"
  const [startTime, endTime] = firm.openingHours.split("-");
  const [startHourStr] = startTime.split(":");
  const [endHourStr] = endTime.split(":");
  const startHour = Number(startHourStr);
  const endHour = Number(endHourStr);

  // Tworzymy listę dostępnych godzin na podstawie godzin otwarcia
  let availableHours: number[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    availableHours.push(hour);
  }

  // Jeśli rezerwacja dotyczy bieżącego dnia, filtrujemy godziny, które już minęły
  const todayISO = new Date().toISOString().split("T")[0];
  let filteredHours = availableHours;
  if (date === todayISO) {
    const now = new Date();
    filteredHours = availableHours.filter((hour) => hour > now.getHours());
  }

  // Wyznaczamy przedział czasu dla danego dnia (od północy do północy kolejnego dnia)
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  // Pobieramy rezerwacje dla danej firmy w wybranym dniu
  const bookings = await prisma.booking.findMany({
    where: {
      firmId: Number(firmId),
      bookingTime: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  // Wyciągamy godziny, w których już są rezerwacje
  const bookedHours = bookings.map((booking) =>
    new Date(booking.bookingTime).getHours()
  );

  // Filtrujemy dostępne godziny – usuwamy te, które są już zajęte
  const freeHours = filteredHours.filter((hour) => !bookedHours.includes(hour));

  // Formatowanie – np. "08:00", "09:00", etc.
  const formattedFreeHours = freeHours.map(
    (hour) => `${hour.toString().padStart(2, "0")}:00`
  );

  return NextResponse.json({ availableSlots: formattedFreeHours });
}

export {};
