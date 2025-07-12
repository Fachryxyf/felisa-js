// app/api/reviews/[id]/route.ts
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

// Mendefinisikan interface untuk parameter route agar lebih rapi dan jelas
interface RouteParams {
  params: {
    id: string;
  };
}

// Mendefinisikan tipe kustom untuk error Prisma
interface PrismaError extends Error {
  code?: string; // Properti 'code' untuk error Prisma (misal: 'P2025')
  meta?: {
    cause?: string;
  };
}

// Type guard untuk memeriksa apakah error adalah instance dari PrismaError
function isPrismaError(err: unknown): err is PrismaError {
  return err instanceof Error && typeof (err as PrismaError).code === 'string';
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<RouteParams['params']> } // params adalah Promise
) {
  let rawId: string = 'unknown'; // Inisialisasi untuk logging
  try {
    // Menunggu Promise params untuk mendapatkan objek params yang sebenarnya
    const resolvedParams = await params;
    rawId = resolvedParams.id; // Simpan id asli untuk logging error
    const id = parseInt(rawId); 

    // Memastikan ID valid sebelum melanjutkan
    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID ulasan tidak valid.' }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Ulasan berhasil dihapus.' });

  } catch (error: unknown) { // 'error' adalah tipe 'unknown'
    // Menggunakan type guard untuk memeriksa apakah ini error Prisma
    if (isPrismaError(error)) {
      if (error.code === 'P2025') { // Prisma error code for record not found
        console.warn(`API DELETE Review: Ulasan dengan ID ${rawId} tidak ditemukan. ${error.meta?.cause ? `Cause: ${error.meta.cause}` : ''}`);
        return NextResponse.json({ message: 'Ulasan tidak ditemukan.' }, { status: 404 });
      }
      // Log error Prisma lainnya jika diperlukan
      console.error(`API DELETE Review Error (ID: ${rawId}, Code: ${error.code}):`, error.message, error);
    } else if (error instanceof Error) {
      // Jika ini adalah objek Error standar
      console.error(`API DELETE Review Error (ID: ${rawId}):`, error.message);
    } else {
      // Untuk error yang tidak dikenal atau non-Error object
      console.error(`API DELETE Review Error (ID: ${rawId}): An unknown error occurred.`, error);
    }
    
    return NextResponse.json({ message: 'Gagal menghapus ulasan karena kesalahan server.' }, { status: 500 });
  }
}