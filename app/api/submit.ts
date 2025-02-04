import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json(); // Pobierz ciało żądania jako JSON
    // Process the data
    return NextResponse.json({ message: 'Data received successfully', data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process the data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'GET method not allowed' }, { status: 405 });
}
