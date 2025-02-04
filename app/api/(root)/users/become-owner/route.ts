import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { TextEncoder } from 'util';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key');

export async function POST(request: Request) {
  try {
    // Pobierz aktualny token JWT z ciasteczka
    const cookieStore = cookies();
    const token = (await cookieStore).get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Nie jesteś zalogowany' },
        { status: 401 }
      );
    }

    // Zweryfikuj token i wyciągnij userId
    let payload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(token, secret);
      payload = verifiedPayload;
    } catch (err) {
      console.error('Token verification failed:', err);
      return NextResponse.json(
        { message: 'Nieprawidłowy token' },
        { status: 401 }
      );
    }

    const userId = payload.userId as number;

    // Zaktualizuj rolę użytkownika w bazie danych
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'OWNER' },
    });

    // Wygeneruj nowy token JWT z zaktualizowaną rolą
    const newToken = await new SignJWT({ userId: updatedUser.id, role: updatedUser.role })
      .setIssuedAt()
      .setExpirationTime('2h')
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(secret);

    // Ustaw nowe ciasteczko 'token' z nowym tokenem
    const response = NextResponse.json(
      { message: 'Rola została zaktualizowana pomyślnie', user: updatedUser },
      { status: 200 }
    );
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 godziny
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Nie udało się zaktualizować roli' },
      { status: 500 }
    );
  }
}
