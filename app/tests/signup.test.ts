// app/tests/signup.test.ts

import { POST } from "../api/(auth)/auth/signup/route"; // Dostosuj ścieżkę, jeśli potrzeba
import prisma from "@/app/lib/prisma";
import { SignJWT } from "jose";

// Zamockuj moduł prisma
jest.mock("@/app/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Zamockuj moduł jose dla generowania JWT
jest.mock("jose", () => ({
  SignJWT: jest.fn().mockImplementation(function (payload) {
    return {
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      setProtectedHeader: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue("signed.jwt.token"),
    };
  }),
}));

describe("Signup API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("zwraca 400, gdy dane wejściowe są nieprawidłowe", async () => {
    const invalidData = {
      email: "not-an-email",
      password: "123", // za krótkie
      username: "ab", // za krótkie
    };

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid email address");
    expect(data.error).toContain("Password must be at least 6 characters long");
    expect(data.error).toContain("Username must be at least 3 characters long");
  });

  it("zwraca 409, gdy użytkownik już istnieje", async () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
      username: "tester",
    };

    // Symulacja znalezienia istniejącego użytkownika
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("User already exists");
  });

  it("poprawnie tworzy nowego użytkownika i ustawia ciasteczko z tokenem", async () => {
    const validData = {
      email: "newuser@example.com",
      password: "password123",
      username: "newuser",
    };

    // Symulacja braku istnienia użytkownika
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    // Symulacja tworzenia użytkownika
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 2,
      email: validData.email,
      username: validData.username,
      role: "CUSTOMER",
    });

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200); // Domyślny status dla NextResponse.json() to 200
    expect(data.message).toBe("User created successfully");
    expect(data.user).toMatchObject({
      id: 2,
      email: validData.email,
      username: validData.username,
      role: "CUSTOMER",
    });

    // Sprawdzenie, czy w nagłówkach odpowiedzi znajduje się ciasteczko token
    const setCookieHeader = response.headers.get("set-cookie");
    expect(setCookieHeader).toContain("token=signed.jwt.token");
  });

  it("zwraca 500, gdy wystąpi błąd przy tworzeniu użytkownika", async () => {
    const validData = {
      email: "erroruser@example.com",
      password: "password123",
      username: "erroruser",
    };

    // Symulacja braku istnienia użytkownika
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    // Symulacja błędu przy tworzeniu użytkownika
    (prisma.user.create as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const request = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(validData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Error creating user");
    expect(data.details).toBe("Database error");
  });
});
