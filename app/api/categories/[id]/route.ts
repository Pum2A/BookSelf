import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request:Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; // Parametry są już dostępne w "params"

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { firm: true }, // Pobieramy też firmę, do której należy
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      const { name } = await request.json();
  
      if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      }
  
      const updatedCategory = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { name },
      });
  
      return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
      console.error('Error updating category:', error);
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }


  }

  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
  
      const deletedCategory = await prisma.category.delete({
        where: { id: parseInt(id) },
      });
  
      return NextResponse.json(deletedCategory, { status: 200 });
    } catch (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
  }
