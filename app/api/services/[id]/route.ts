import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

// GET - pobiera usługę o danym ID
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Walidacja parametru - upewniamy się, że jest liczbą
  const serviceId = parseInt(params.id, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { owner: { select: { username: true, avatar: true } } },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - aktualizuje usługę
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Walidacja parametru
  const serviceId = parseInt(params.id, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.ownerId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only update your own services.' },
        { status: 403 }
      );
    }

    const { name, description, price } = await request.json();
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { name, description, price: parseFloat(price) },
    });

    return NextResponse.json(
      { message: 'Service updated successfully', service: updatedService },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - usuwa usługę
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Walidacja parametru
  const serviceId = parseInt(params.id, 10);
  if (isNaN(serviceId)) {
    return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
  }

  try {
    const user = await getCurrentUser();
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.ownerId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own services.' },
        { status: 403 }
      );
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return NextResponse.json(
      { message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
