import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";

export async function getUserFromToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    console.log('Verifying token:', token);  // Log tokenu przed weryfikacją
    const decoded = jwt.verify(token, secret) as { userId: number };
    
    console.log('Decoded token:', decoded); // Log dekodowanego tokenu

    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    console.log('Found user:', user); // Log użytkownika

    return user;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
