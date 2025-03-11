import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { UserRole } from "@prisma/client";
import { SignJWT } from "jose";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email({ message: "Nieprawidłowy adres email" }),
  password: z.string().min(6, { message: "Hasło musi mieć minimum 6 znaków" }),
  username: z
    .string()
    .min(3, { message: "Nazwa użytkownika musi mieć minimum 3 znaki" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = signupSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    const { email, password, username } = parseResult.data;

    // Sprawdzenie czy email jest dostępny
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Użytkownik z tym adresem email już istnieje" },
        { status: 409 }
      );
    }

    // Haszowanie hasła
    const hashedPassword = await bcrypt.hash(password, 12);

    // Utworzenie użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role: UserRole.CUSTOMER, // Upewnij się że wartość zgadza się z enumem w Prisma
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });

    // Generowanie JWT
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
      { status: 201 } // Użyj statusu 201 dla nowo utworzonych zasobów
    );

    // Ustawienie ciasteczka
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 2, // 2 godziny
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[SIGNUP_ERROR]", error);
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
