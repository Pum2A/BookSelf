import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized. Only customers can create bookings.' },
        { status: 403 }
      );
    }

    const { serviceId, date, time } = await request.json();

    if (!serviceId || !date || !time) {
      return NextResponse.json(
        { error: 'Service ID, date, and time are required' },
        { status: 400 }
      );
    }

    // Check if the service exists
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        serviceId: parseInt(serviceId),
        userId: user.id,
        date: new Date(date),
        time: new Date(time),
        status: 'pending',
      },
    });

    return NextResponse.json(
      { message: 'Booking created successfully', booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error.message },
      { status: 500 }
    );
  }
}