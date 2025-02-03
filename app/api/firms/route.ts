// pages/api/firms/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const firms = await prisma.firm.findMany();
    res.status(200).json(firms);
  } else if (req.method === 'POST') {
    const { name, description, location, openingHours, ownerId } = req.body;

    try {
      const newFirm = await prisma.firm.create({
        data: {
          name,
          description,
          location,
          openingHours,
          ownerId,
        },
      });
      res.status(201).json(newFirm);
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się utworzyć firmy', error });
    }
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona' });
  }
}
