import { middleware } from "../../middleware";
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

describe("Middleware", () => {
  const baseUrl = "http://localhost";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("przekierowuje do /signin, gdy token nie istnieje", async () => {
    const request = new NextRequest(`${baseUrl}/`, { headers: new Headers() });
    const response = await middleware(request);
    expect(response.headers.get("location")).toContain("/signin");
  });

  it("przekierowuje CUSTOMER próbującego dostać się do /firms na /access-denied", async () => {
    const fakeToken = "fake.jwt.token";
    const request = new NextRequest(`${baseUrl}/firms/some-page`, {
      headers: new Headers(),
    });
    Object.defineProperty(request, "cookies", {
      value: {
        get: (name: string) =>
          name === "token" ? { value: fakeToken } : undefined,
      },
    });

    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: { role: "CUSTOMER" },
    });

    const response = await middleware(request);
    expect(response.headers.get("location")).toContain("/access-denied");
  });

  it("pozwala CUSTOMER na dostęp do dozwolonej ścieżki", async () => {
    const fakeToken = "fake.jwt.token";
    const request = new NextRequest(`${baseUrl}/`, { headers: new Headers() });
    Object.defineProperty(request, "cookies", {
      value: {
        get: (name: string) =>
          name === "token" ? { value: fakeToken } : undefined,
      },
    });

    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: { role: "CUSTOMER" },
    });

    const response = await middleware(request);
    // Dla NextResponse.next() nie ma nagłówka "location", co oznacza brak przekierowania
    expect(response.headers.get("location")).toBeNull();
  });

  it("przekierowuje OWNER, gdy próbuje dostać się do /bookings", async () => {
    const fakeToken = "fake.jwt.token";
    const request = new NextRequest(`${baseUrl}/bookings`, {
      headers: new Headers(),
    });
    Object.defineProperty(request, "cookies", {
      value: {
        get: (name: string) =>
          name === "token" ? { value: fakeToken } : undefined,
      },
    });

    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: { role: "OWNER" },
    });

    const response = await middleware(request);
    expect(response.headers.get("location")).toContain("/access-denied");
  });
});
