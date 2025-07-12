// app/api/user/profile/route.ts
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const adminEmail = 'admin@gmail.com';
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { name: true, phone: true, email: true, image: true }, // Ambil data image
    });

    if (!user) return NextResponse.json({ message: 'User tidak ditemukan.' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error('API GET Profile Error:', error);
    return NextResponse.json({ message: 'Gagal mengambil data profil.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { name, phone, image } = await request.json(); // Terima data image
    const adminEmail = 'admin@gmail.com';
    const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!adminUser) return NextResponse.json({ success: false, message: 'User admin tidak ditemukan.' }, { status: 404 });

    const updatedUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        name: name,
        phone: phone,
        image: image, // Simpan data image
      },
    });

    return NextResponse.json({ success: true, message: 'Profil berhasil diperbarui.', user: updatedUser });
  } catch (error) {
    console.error('API Update Profile Error:', error);
    return NextResponse.json({ success: false, message: 'Gagal memperbarui profil.' }, { status: 500 });
  }
}