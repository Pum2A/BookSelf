// pages/api/menu/route.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const menuItems = await prisma.menuItem.findMany();
    res.status(200).json(menuItems);
  } else if (req.method === 'POST') {
    const { name, description, price, category, firmId } = req.body;

    try {
      const newMenuItem = await prisma.menuItem.create({
        data: {
          name,
          description,
          price,
          category,
          firmId,
        },
      });
      res.status(201).json(newMenuItem);
    } catch (error) {
      res.status(400).json({ message: 'Nie udało się utworzyć elementu menu', error });
    }
  } else {
    res.status(405).json({ message: 'Metoda niedozwolona' });
  }
}
