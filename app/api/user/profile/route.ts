// app/api/user/profile/route.ts

import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const { name, phone } = await request.json();

    // NOTE: Ini adalah penyederhanaan. Kita cari user berdasarkan email admin.
    const adminEmail = 'admin@gmail.com';

    // 1. Cari dulu user admin berdasarkan email untuk mendapatkan ID-nya
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    // Jika karena suatu hal user admin tidak ada, kirim error
    if (!adminUser) {
      return NextResponse.json({ success: false, message: 'User admin tidak ditemukan.' }, { status: 404 });
    }

    // 2. Gunakan ID yang ditemukan untuk melakukan update
    const updatedUser = await prisma.user.update({
      where: { id: adminUser.id }, // Gunakan ID dari hasil pencarian
      data: {
        name: name,
        phone: phone,
      },
    });

    return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui.', user: updatedUser });

  } catch (error) {
    console.error('API Update Profile Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil.' }, { status: 500 });
  }
}