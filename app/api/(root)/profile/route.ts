import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import path from "path";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import { Readable } from "stream";
import { promises as fs } from "fs";

export const config = {
  api: {
    bodyParser: false, // Wyłącz domyślny parser
  },
};

const UPLOAD_DIR = path.join(process.cwd(), "/public/uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Tworzy katalog, jeśli nie istnieje
async function ensureUploadDirExists() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

// Parsuje formularz za pomocą formidable
async function parseForm(req: NextRequest) {
  const form = new IncomingForm({
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
  });

  const buffer = Buffer.from(await req.arrayBuffer());
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const incomingMessage = Object.assign(stream as IncomingMessage, {
    headers: {
      "content-type": req.headers.get("content-type") || "",
      "content-length": buffer.length.toString(),
    },
    method: req.method,
    url: req.url,
  });

  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(incomingMessage, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Weryfikuje token JWT i zwraca ID użytkownika
function verifyToken(req: NextRequest): number {
  const cookiesHeader = req.headers.get("cookie");
  const cookies = cookie.parse(cookiesHeader || "");
  const token = cookies.token;

  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

  if (!decoded || !decoded.userId) {
    throw new Error("Invalid token");
  }

  return decoded.userId;
}

// Aktualizuje profil użytkownika w bazie danych
async function updateUser(userId: number, username: string, bio: string, avatarPath?: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { username, bio, avatar: avatarPath },
  });
}

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDirExists();

    const userId = verifyToken(req);
    const { fields, files } = await parseForm(req);

    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const bio = Array.isArray(fields.bio) ? fields.bio[0] : fields.bio;

    const avatarFile = files.avatar ? files.avatar[0] : undefined;
    const avatarPath = avatarFile ? `/uploads/${avatarFile.newFilename}` : undefined;

    const updatedUser = await updateUser(userId, username, bio, avatarPath);

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
