// app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // Usuwamy token z ciasteczek
  const response = NextResponse.json({ message: 'Successfully signed out' });
  response.cookies.delete('token');  // Usuwamy token

  // Zwracamy odpowiedź, że użytkownik został wylogowany
  return response;
}
