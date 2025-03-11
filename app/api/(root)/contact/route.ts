import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, message } = await request.json();

  try {
    const sendGridResponse = await fetch(
      "https://api.sendgrid.com/v3/mail/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: "dominikpum2a@gmail.com" }],
              subject: `Nowa wiadomość od ${email}`,
            },
          ],
          from: { email: "noreply@example.com", name: "Formularz kontaktowy" },
          content: [
            {
              type: "text/plain",
              value: `Email: ${email}\nWiadomość:\n${message}`,
            },
          ],
        }),
      }
    );

    if (!sendGridResponse.ok) {
      const error = await sendGridResponse.json();
      throw new Error(error.errors[0]?.message || "Błąd SendGrid");
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Błąd:", error);
    return NextResponse.json(
      { error: error.message || "Wewnętrzny błąd serwera" },
      { status: 500 }
    );
  }
}
