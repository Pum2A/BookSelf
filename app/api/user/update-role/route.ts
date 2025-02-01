// app/api/user/update-role/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Nie jesteś zalogowany' }, { status: 401 });
    }

    const { newRole } = await request.json();
    if (!newRole || (newRole !== 'owner' && newRole !== 'customer')) {
      return NextResponse.json({ error: 'Podano niepoprawną rolę' }, { status: 400 });
    }

    // Aktualizacja roli użytkownika
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: newRole },
    });

    return NextResponse.json({ message: `Rola zmieniona na ${newRole}`, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('Błąd podczas aktualizacji roli:', error);
    return NextResponse.json({ error: 'Błąd podczas aktualizacji roli', details: error.message }, { status: 500 });
  }
}
