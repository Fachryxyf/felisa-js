// app/api/auth/reset-password/route.ts
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token dan password dibutuhkan.' }, { status: 400 });
    }

    // 1. Hash token dari URL untuk dicocokkan dengan yang ada di DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Cari token di database
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    // 3. Validasi token: apakah ada dan belum kedaluwarsa
    if (!passwordResetToken || new Date() > passwordResetToken.expiresAt) {
      return NextResponse.json({ message: 'Token tidak valid atau sudah kedaluwarsa.' }, { status: 400 });
    }

    // 4. Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Update password user yang sesuai
    await prisma.user.update({
      where: { id: passwordResetToken.userId },
      data: { password: hashedPassword },
    });

    // 6. Hapus token yang sudah dipakai
    await prisma.passwordResetToken.delete({
      where: { id: passwordResetToken.id },
    });

    return NextResponse.json({ success: true, message: 'Password berhasil direset.' });

  } catch (error) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server.' }, { status: 500 });
  }
}