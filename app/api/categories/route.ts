import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized. Only owners can create categories.' },
        { status: 403 }
      );
    }

    const { name, firmId } = await request.json();
    if (!name || !firmId) {
      return NextResponse.json(
        { error: 'Name and firm ID are required' },
        { status: 400 }
      );
    }

    const createdCategory = await prisma.category.create({
      data: {
        name,
        firmId: parseInt(firmId),
      },
    });

    return NextResponse.json(
      { message: 'Category created successfully', category: createdCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}