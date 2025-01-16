import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/app/lib/prisma';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers'; // import cookies

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const jwt = await new SignJWT({ userId: user.id })
    .setIssuedAt()
    .setExpirationTime('1h')
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .sign(new TextEncoder().encode(secret));

  // Zapisanie tokenu w cookies
  const response = NextResponse.json({
    message: 'Signed in successfully',
    token: jwt,
  });
  response.cookies.set('token', jwt, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  return response;
}
