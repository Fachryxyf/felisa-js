// app/api/reviews/route.ts
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('API GET Reviews Error:', error);
    return NextResponse.json({ message: 'Gagal mengambil data ulasan.' }, { status: 500 });
  }
}