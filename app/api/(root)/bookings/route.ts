import prisma from '@/app/lib/prisma';
import { BookingStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bookings = await prisma.booking.findMany();
    res.status(200).json(bookings);
    // Process a POST request
  } else if(req.method === 'POST') {
    const {bookingTime, numberOfPeople, status, customerId, firmId} = req.body;
    try{
        const newBooking = await prisma.booking.create({
            data: {
                bookingTime: new Date(bookingTime),
                numberOfPeople,
                status: status || BookingStatus.PENDING,
                customerId,
                firmId
            },
        });
        res.status(201).json(newBooking);
    } catch(error){
        res.status(400).json({message: 'Error creating booking'});
    }
    // Handle any other HTTP method
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}