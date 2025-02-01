import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/app/lib/prisma'; // Import Prisma from your existing file

// Ensure JWT_SECRET is set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

/**
 * Fetches the current authenticated user from the database using the JWT token.
 * @returns The authenticated user object.
 * @throws Error if the token is invalid, expired, or the user is not found.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = (await cookieStore).get('token')?.value;

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid or expired token');
  }
}