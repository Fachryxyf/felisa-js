// app/api/auth/forgot-password/route.ts

import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email wajib diisi.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ditemukan, kirim pesan error
    if (!user) {
      return NextResponse.json({ message: 'Email tidak terdaftar.' }, { status: 404 });
    }

    // Jika user ditemukan, kirim respons sukses beserta ID user
    return NextResponse.json({ 
      success: true, 
      message: 'Email valid.',
      userId: user.id 
    });

  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}