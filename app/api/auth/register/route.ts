// app/api/auth/register/route.ts

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validasi dasar: pastikan semua data ada
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 }); // 409 Conflict
    }

    // 2. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Buat pengguna baru di database
    const newUser = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email,
        password: hashedPassword,
      },
    });

    // 4. Kirim respons berhasil (tanpa data sensitif)
    return NextResponse.json({ 
      message: 'Registrasi berhasil!',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('API Register Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}