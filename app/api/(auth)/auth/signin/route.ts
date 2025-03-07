// app/api/auth/signin/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { SignJWT } from "jose";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = signinSchema.safeParse(body);
    if (!parseResult.success) {
      const errors = parseResult.error.errors
        .map((err) => err.message)
        .join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { email, password } = parseResult.data;

    // Znalezienie użytkownika po emailu
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Weryfikacja hasła
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generowanie JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    // Ustawienie tokenu w ciasteczku
    const response = NextResponse.json({
      message: "Sign-in successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 godziny
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
