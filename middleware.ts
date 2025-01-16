import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = process.env.JWT_SECRET || 'your-secret-key'; 

export async function middleware(request: Request) {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next(); // Jeśli token jest ważny, przejdź do strony
  } catch (error) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/home', '/about', '/booking', '/history', '/favorites', '/support'],
};
