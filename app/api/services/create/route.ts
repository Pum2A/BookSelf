import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request:Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized. Only owners can create services.' },
        { status: 403 }
      );
    }

    const { services } = await request.json();
    if (!services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'At least one service is required' },
        { status: 400 }
      );
    }

    const createdServices = [];
    for (const service of services) {
      const { name, description, price } = service;
      if (!name || !description || !price) {
        return NextResponse.json(
          { error: 'Name, description, and price are required for each service' },
          { status: 400 }
        );
      }

      const createdService = await prisma.service.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          ownerId: user.id,
        },
      });
      createdServices.push(createdService);
    }

    return NextResponse.json(
      { message: 'Services created successfully', services: createdServices },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating services:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create services', details: errorMessage },
      { status: 500 }
    );
  }
}
