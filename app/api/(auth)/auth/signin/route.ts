import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { SignJWT } from "jose";
import { z } from "zod";

const signinSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  password: z.string().min(1, { message: "Hasło jest wymagane" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = signinSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // Znajdź użytkownika
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        email: true,
        username: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nieprawidłowe dane logowania" },
        { status: 401 }
      );
    }

    // Weryfikacja hasła
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Nieprawidłowe dane logowania" },
        { status: 401 }
      );
    }

    // Generowanie tokenu
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default-secret-key"
    );

    const token = await new SignJWT({
      userId: user.id,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secret);

    // Konfiguracja odpowiedzi
    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      { status: 200 }
    );

    // Ustawienie ciasteczka
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[SIGNIN_ERROR]", error);
    return NextResponse.json(
      {
        error: "Wewnętrzny błąd serwera",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
