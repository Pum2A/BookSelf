import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: parseInt(params.id) },
      include: { owner: { select: { username: true, avatar: true } } },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error: any) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    const service = await prisma.service.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!service || service.ownerId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only update your own services.' },
        { status: 403 }
      );
    }

    const { name, description, price } = await request.json();
    const updatedService = await prisma.service.update({
      where: { id: parseInt(params.id) },
      data: { name, description, price: parseFloat(price) },
    });

    return NextResponse.json(
      { message: 'Service updated successfully', service: updatedService },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    const service = await prisma.service.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!service || service.ownerId !== user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. You can only delete your own services.' },
        { status: 403 }
      );
    }

    await prisma.service.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(
      { message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service', details: error.message },
      { status: 500 }
    );
  }
}