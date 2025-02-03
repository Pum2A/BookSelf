// pages/api/bookings/[id]/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'Rezerwacja nie znaleziona' });
    }
  } else if (req.method === 'PUT') {
    const { bookingTime, numberOfPeople, status } = req.body;

    try {
      const updatedBooking = await prisma.booking.update({
        where: { id: Number(id) },
        data: {
          bookingTime: bookingTime ? new Date(bookingTime) : undefined,
          numberOfPeople,
          status: status || BookingStatus.PENDING,
        },
      });
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się zaktualizować rezerwacji', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.booking.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się usunąć rezerwacji', error });
    }
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona' });
  }
}
