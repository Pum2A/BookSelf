import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Pobranie konkretnej rezerwacji
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(params.id) },
  });

  if (!booking) {
    return NextResponse.json(
      { message: "Rezerwacja nie znaleziona" },
      { status: 404 }
    );
  }

  return NextResponse.json(booking, { status: 200 });
}

// Aktualizacja rezerwacji
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { bookingTime, numberOfPeople, status } = await req.json();

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: Number(params.id) },
      data: {
        bookingTime: bookingTime ? new Date(bookingTime) : undefined,
        numberOfPeople,
        status: status || "PENDING",
      },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Nie udało się zaktualizować rezerwacji", error },
      { status: 400 }
    );
  }
}

// Usunięcie rezerwacji (Anulowanie)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.booking.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Rezerwacja anulowana" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Nie udało się usunąć rezerwacji", error },
      { status: 400 }
    );
  }
}
