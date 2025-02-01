import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

interface Params {
    id: string;
}

interface RequestParams {
    params: Promise<Params>;
}

interface Firm {
    id: number;
    categories: any[]; // You may want to define a proper Category interface
    // Add other firm properties as needed
}

export async function GET(request: Request, props: RequestParams): Promise<NextResponse> {
    const params = await props.params;
    try {
        const { id } = params;
        
        // Pobieramy firmę z kategoriami na podstawie ID
        const firm = await prisma.firm.findUnique({
            where: { id: parseInt(id) },
            include: { categories: true }, // Dołączamy kategorie
        }) as Firm | null;

        if (!firm) {
            return NextResponse.json({ error: 'Firm not found' }, { status: 404 });
        }

        return NextResponse.json(firm, { status: 200 });
    } catch (error) {
        console.error('Error fetching firm:', error);
        return NextResponse.json({ error: 'Failed to fetch firm' }, { status: 500 });
    }
}
