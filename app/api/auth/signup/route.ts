import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    // Sprawdzanie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Haszowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: 'Error creating user', details: error.message },
      { status: 500 }
    );
  }
}
