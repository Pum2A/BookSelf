// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Usuwamy token z ciasteczek
    const response = NextResponse.json(
      { message: "Successfully signed out" },
      { status: 200 }
    );
    response.cookies.delete({
      name: "token",
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Error during signout:", error);
    return NextResponse.json(
      { message: "Failed to sign out" },
      { status: 500 }
    );
  }
}
