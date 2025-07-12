// app/api/auth/login/route.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Cari pengguna di database berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // 2. Jika pengguna tidak ditemukan, kirim error
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email atau kata sandi salah.' }),
        { status: 401 }
      );
    }

    // 3. Bandingkan password yang dikirim dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // 4. Jika password tidak cocok, kirim error
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email atau kata sandi salah.' }),
        { status: 401 }
      );
    }

    // 5. Jika email dan password cocok, buat session cookie
    const sessionToken = 'user-is-logged-in'; // Token sederhana
    const cookie = serialize('auth_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: '/',
    });

    // Kirim respons sukses beserta cookie
    return new Response(JSON.stringify({
      success: true,
      message: 'Login berhasil!',
    }), {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error) {
    console.error('API Login Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Terjadi kesalahan pada server.' }),
      { status: 500 }
    );
  } finally {
    // Selalu tutup koneksi prisma setelah selesai
    await prisma.$disconnect();
  }
}