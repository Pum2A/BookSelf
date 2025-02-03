// pages/api/menu/[menuItemId]/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { menuItemId } = req.query;

  if (req.method === 'GET') {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id: Number(menuItemId) },
    });
    if (menuItem) {
      res.status(200).json(menuItem);
    } else {
      res.status(404).json({ message: 'Element menu nie znaleziony' });
    }
  } else if (req.method === 'PUT') {
    const { name, description, price, category } = req.body;

    try {
      const updatedMenuItem = await prisma.menuItem.update({
        where: { id: Number(menuItemId) },
        data: {
          name,
          description,
          price,
          category,
        },
      });
      res.status(200).json(updatedMenuItem);
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się zaktualizować elementu menu', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.menuItem.delete({
        where: { id: Number(menuItemId) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się usunąć elementu menu', error });
    }
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona' });
  }
}
