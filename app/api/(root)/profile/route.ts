import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false,
  },
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function verifyToken(req: NextRequest): number {
  const cookiesHeader = req.headers.get("cookie");
  const cookies = cookie.parse(cookiesHeader || "");
  const token = cookies.token;

  if (!token) throw new Error("No token provided");

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
  if (!decoded?.userId) throw new Error("Invalid token");

  return decoded.userId;
}

export async function POST(req: NextRequest) {
  try {
    const userId = verifyToken(req);
    const formData = await req.formData();

    // Walidacja danych
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!username) throw new Error("Username is required");

    // Obsługa pliku
    let avatarUrl: string | undefined;
    if (avatarFile) {
      if (avatarFile.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds 5MB limit");
      }

      const blob = await put(`avatars/${userId}-${Date.now()}`, avatarFile, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      avatarUrl = blob.url;
    }

    // Aktualizacja użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        bio,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
