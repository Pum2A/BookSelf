import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma";

export const getUserFromToken = async (token: string) => {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const decoded = jwt.verify(token, secret) as { userId: number };

    if (decoded && decoded.userId) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      return user;
    }
    return null;
  } catch (error) {
    console.error("Invalid token", error);
    return null;  // Możesz również zwrócić dodatkowe informacje o błędzie
  }
};
