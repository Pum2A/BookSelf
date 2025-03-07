// app/api/contact/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { email, message } = await request.json();

  // Utwórz testowe konto Ethereal (używane tylko do celów deweloperskich)
  const testAccount = await nodemailer.createTestAccount();

  // Konfiguracja transportera z użyciem Ethereal
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  try {
    const mailOptions = {
      from: `"Contact Form" <${email}>`, // email nadawcy będzie adresem wpisanym przez użytkownika
      to: "dominikpum2a@gmail.com", // zamień na swój adres email
      subject: `Wiadomość od ${email}`, // temat zawiera email nadawcy
      text: message,
      html: `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    // Dla testów możesz uzyskać URL podglądu wiadomości (z Ethereal)
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Podgląd wiadomości:", previewUrl);

    return NextResponse.json({ success: true, previewUrl });
  } catch (error) {
    console.error("Błąd podczas wysyłania maila:", error);
    return NextResponse.json(
      { error: "Wystąpił problem podczas wysyłki wiadomości" },
      { status: 500 }
    );
  }
}
