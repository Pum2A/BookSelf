import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized. Only owners can create services.' },
        { status: 403 }
      );
    }

    const { name, description, price, categoryId } = await request.json();
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, description, price, and category ID are required' },
        { status: 400 }
      );
    }

    const createdService = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        ownerId: user.id,
      },
    });

    return NextResponse.json(
      { message: 'Service created successfully', service: createdService },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}