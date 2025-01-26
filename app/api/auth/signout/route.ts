// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Usuwamy token z ciasteczek
    const response = NextResponse.json({ message: 'Successfully signed out' }, { status: 200 });
    response.cookies.delete('token'); // Usuwamy token

    // Zwracamy odpowiedź, że użytkownik został wylogowany
    return response;
  } catch (error) {
    console.error('Error during signout:', error);

    // Zwracamy błąd, jeśli coś poszło nie tak
    return NextResponse.json({ message: 'Failed to sign out' }, { status: 500 });
  }
}
