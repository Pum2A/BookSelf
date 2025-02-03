// pages/api/firms/[id]/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const firm = await prisma.firm.findUnique({
      where: { id: Number(id) },
    });
    if (firm) {
      res.status(200).json(firm);
    } else {
      res.status(404).json({ message: 'Firma nie znaleziona' });
    }
  } else if (req.method === 'PUT') {
    const { name, description, location, openingHours } = req.body;

    try {
      const updatedFirm = await prisma.firm.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          location,
          openingHours,
        },
      });
      res.status(200).json(updatedFirm);
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się zaktualizować firmy', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.firm.delete({
        where: { id: Number(id) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się usunąć firmy', error });
    }
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona' });
  }
}
