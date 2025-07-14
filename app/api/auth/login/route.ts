// app/api/auth/login/route.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Email atau kata sandi salah.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Email atau kata sandi salah.' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role, // Sertakan role di dalam token
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '7d' });

    const cookie = serialize('auth_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Sertakan juga role di dalam respons JSON
    return NextResponse.json({
        success: true,
        message: 'Login berhasil!',
        user: { role: user.role }
    }, {
        status: 200,
        headers: { 'Set-Cookie': cookie }
    });

  } catch (error) {
    console.error('API Login Error:', error);
    return NextResponse.json({ success: false, message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}