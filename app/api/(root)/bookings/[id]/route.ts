import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_key"
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Nieprawidłowe ID" }, { status: 400 });
  }

  // Example logic – fetch the booking
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      firm: { select: { name: true } },
      menuItem: { select: { name: true } },
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Nie znaleziono rezerwacji" },
      { status: 404 }
    );
  }

  return NextResponse.json(booking);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Nieprawidłowe ID" }, { status: 400 });
  }

  // Extract data from the request body
  const { bookingTime, numberOfPeople, status } = await request.json();
  const existingBooking = await prisma.booking.findUnique({ where: { id } });
  if (!existingBooking) {
    return NextResponse.json(
      { error: "Nie znaleziono rezerwacji" },
      { status: 404 }
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: {
      bookingTime: bookingTime
        ? new Date(bookingTime)
        : existingBooking.bookingTime,
      numberOfPeople: numberOfPeople || existingBooking.numberOfPeople,
      status: status || existingBooking.status,
    },
  });

  return NextResponse.json(updatedBooking);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Nieprawidłowe ID" }, { status: 400 });
  }

  const existingBooking = await prisma.booking.findUnique({ where: { id } });
  if (!existingBooking) {
    return NextResponse.json(
      { error: "Nie znaleziono rezerwacji" },
      { status: 404 }
    );
  }

  await prisma.booking.delete({ where: { id } });
  return NextResponse.json(
    { message: "Rezerwacja usunięta pomyślnie" },
    { status: 200 }
  );
}

// Empty export to ensure this file is treated as a module
export {};
