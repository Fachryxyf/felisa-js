// app/api/reviews/[id]/route.ts
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.review.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Ulasan berhasil dihapus.' });
  } catch (error) {
    console.error(`API DELETE Review Error (ID: ${params.id}):`, error);
    return NextResponse.json({ message: 'Gagal menghapus ulasan.' }, { status: 500 });
  }
}