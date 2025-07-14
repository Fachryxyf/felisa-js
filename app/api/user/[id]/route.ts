import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { Role } from '@prisma/client';

// Fungsi GET untuk mengambil satu user
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(`debug`, error);
    return NextResponse.json({ message: "Gagal mengambil data user." }, { status: 500 });
  }
}

// Fungsi PATCH untuk mengupdate user
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, phone, role } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        phone,
        role: role as Role, // Pastikan role sesuai dengan tipe enum
      },
    });
    return NextResponse.json({ success: true, message: "User berhasil diperbarui.", user: updatedUser });
  } catch (error) {
    console.error(`debug`, error);
    return NextResponse.json({ message: "Gagal memperbarui user." }, { status: 500 });
  }
}

// Fungsi DELETE (tidak berubah)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    console.error(`debug`, error);
    return NextResponse.json({ message: 'Gagal menghapus user.' }, { status: 500 });
  }
}