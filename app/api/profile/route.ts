import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server'; // Importujemy NextResponse
import prisma from '@/app/lib/prisma'; // Instancja Prisma
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import formidable, { IncomingForm } from 'formidable';

// Konfiguracja `formidable` (parsing formularzy)
export const config = {
  api: {
    bodyParser: false, // Wyłączenie domyślnego body parsera w Next.js, ponieważ używamy `formidable`
  },
};

export const POST = async (req: NextApiRequest) => {
  try {
    // Sprawdzamy, czy istnieje token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Weryfikacja tokena JWT
    const secret = process.env.JWT_SECRET || "your-secret-key";
const decoded = jwt.verify(token, secret) as { userId: number };


    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Tworzymy formData, który pozwoli na obsługę pliku
    const formData = await new Promise<any>((resolve, reject) => {
      const form = new IncomingForm({
        uploadDir: path.join(process.cwd(), 'public/uploads'),
        keepExtensions: true,
      });

      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { fields, files } = formData;
    const username = Array.isArray(fields.username) ? fields.username[0] : fields.username;
    const bio = Array.isArray(fields.bio) ? fields.bio[0] : fields.bio;
    const avatar = files.avatar ? `/uploads/${files.avatar[0].newFilename}` : undefined;

    // Aktualizacja danych użytkownika w bazie danych
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        username,
        bio,
        avatar,
      },
    });

    return NextResponse.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
};
