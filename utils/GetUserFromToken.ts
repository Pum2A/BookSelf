import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";
export async function getUserFromToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing in .env!");
      return null;
    }

    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, secret) as { userId: number };

    console.log("Decoded token:", decoded);

    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token: missing userId");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new Error(`User with ID ${decoded.userId} not found`);
    }

    console.log("Found user:", user);
    return user;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
