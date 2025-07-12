// app/api/user/password/route.ts

import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';

export async function PATCH(request: Request) {
  try {
    const { oldPassword, newPassword } = await request.json();
    
    // Validasi input dasar
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ message: 'Password lama dan baru wajib diisi.' }, { status: 400 });
    }

    // Penyederhanaan: Cari user berdasarkan email admin
    const adminEmail = 'admin@gmail.com';
    const user = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan.' }, { status: 404 });
    }

    // 1. Verifikasi password lama
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return NextResponse.json({ message: 'Password lama salah.' }, { status: 401 });
    }

    // 2. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Update password di database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui.' });

  } catch (error) {
    console.error('API Change Password Error:', error);
    return NextResponse.json({ message: 'Gagal memperbarui password.' }, { status: 500 });
  }
}