// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { UserRole } from "@prisma/client";
import { SignJWT } from "jose";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  role: z.enum(["user"]).optional(), // opcjonalnie – domyślnie "user"
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = signupSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { email, password, username, role } = parseResult.data;

    // Sprawdzanie, czy użytkownik już istnieje
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Haszowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika (domyślnie rola "user", jeśli nie podano)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: UserRole.CUSTOMER,
      },
    });

    // Generowanie JWT
    const secret = process.env.JWT_SECRET || "your-secret-key";
    const jwt = await new SignJWT({
      userId: user.id,
      role: user.role,
    })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(new TextEncoder().encode(secret));

    // Ustawienie tokenu w ciasteczku
    const response = NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
    response.cookies.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 godziny
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Error creating user", details: error.message },
      { status: 500 }
    );
  }
}
