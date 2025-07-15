// app/api/reviews/route.ts
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

// FUNGSI GET UNTUK MENGAMBIL SEMUA ULASAN
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true } }, // Ambil nama dari user yang terhubung (jika ada)
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("API GET Reviews Error:", error);
    return NextResponse.json({ message: 'Gagal mengambil data ulasan.' }, { status: 500 });
  }
}

// FUNGSI POST UNTUK MENGIRIM ULASAN BARU
export async function POST(request: Request) {
  try {
    const sessionCookie = cookies().get('auth_session');
    if (!sessionCookie) {
      return NextResponse.json({ message: 'Anda harus login untuk memberi ulasan.' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(sessionCookie.value, secret);
    const loggedInUserId = payload.userId as number;
    const loggedInUserName = payload.name as string;

    const data = await request.json();
    const { comment, productId, ...ratings } = data;

    if (!comment || !productId) {
      return NextResponse.json({ message: 'Komentar dan produk wajib diisi.' }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        comment,
        productId,
        ratingWaktu: ratings.ratingWaktu,
        ratingHarga: ratings.ratingHarga,
        ratingBahan: ratings.ratingBahan,
        ratingDesain: ratings.ratingDesain,
        ratingPackaging: ratings.ratingPackaging,
        userId: loggedInUserId,
        reviewerName: loggedInUserName,
      }
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });

  } catch (error) {
    console.error('API POST Review Error:', error);
    if (error instanceof jose.errors.JWTExpired) {
        return NextResponse.json({ message: 'Sesi Anda telah berakhir. Silakan login kembali.' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Gagal mengirim ulasan.' }, { status: 500 });
  }
}