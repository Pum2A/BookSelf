import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { email, password, username, role } = await request.json();

    if (!email || !password || !username ) {
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
        role,
      },
    });

    // Generowanie JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const jwt = await new SignJWT({ userId: user.id })
      .setIssuedAt()
      .setExpirationTime('1h')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(new TextEncoder().encode(secret));

    // Zapisanie tokenu w ciasteczkach
    const response = NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
    response.cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 godziny
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: 'Error creating user', details: error.message },
      { status: 500 }
    );
  }
}
