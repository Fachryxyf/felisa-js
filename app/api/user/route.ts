// app/api/user/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Impor prisma

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    // Gunakan variabel error untuk logging
    console.error("API GET Users Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data user." }, { status: 500 });
  }
}