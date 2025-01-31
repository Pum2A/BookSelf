import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(params.id) },
      include: { service: true, user: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error: any) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!booking || booking.userId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only update your own bookings.' },
        { status: 403 }
      );
    }

    const { date, time } = await request.json();
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(params.id) },
      data: { date: new Date(date), time: new Date(time) },
    });

    return NextResponse.json(
      { message: 'Booking updated successfully', booking: updatedBooking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!booking || booking.userId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own bookings.' },
        { status: 403 }
      );
    }

    await prisma.booking.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: 'Booking deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking', details: error.message },
      { status: 500 }
    );
  }
}