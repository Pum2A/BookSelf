import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request:Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized. Only owners can create firms.' },
        { status: 403 }
      );
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Firm name is required' },
        { status: 400 }
      );
    }

    const createdFirm = await prisma.firm.create({
      data: {
        name,
        ownerId: user.id,
      },
    });

    return NextResponse.json(
      { message: 'Firm created successfully', firm: createdFirm },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating firm:', error);
    return NextResponse.json(
      { error: 'Failed to create firm' },
      { status: 500 }
    );
  }
}

// NOWA FUNKCJA GET
export async function GET() {
  try {
    const firms = await prisma.firm.findMany(); // Pobieramy wszystkie firmy
    return NextResponse.json(firms, { status: 200 });
  } catch (error) {
    console.error('Error fetching firms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch firms' },
      { status: 500 }
    );
  }
}
