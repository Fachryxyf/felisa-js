// app/api/orders/route.ts

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import type { CartItem } from '../../context/AppContext';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phoneNumber, cartItems, totalAmount } = body;

    if (!customerName || !phoneNumber || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: 'Data tidak lengkap.' }, { status: 400 });
    }

    // Gunakan transaksi Prisma untuk memastikan semua operasi berhasil atau tidak sama sekali
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Cek ketersediaan stok untuk semua item di keranjang
      for (const item of cartItems) {
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product || product.stock < item.quantity) {
          // Jika stok tidak cukup, batalkan transaksi dengan melempar error
          throw new Error(`Stok untuk produk "${item.name}" tidak mencukupi.`);
        }
      }

      // 2. Jika semua stok aman, buat catatan Order utama
      const order = await tx.order.create({
        data: {
          customerName,
          customerPhone: phoneNumber, // Simpan nomor telepon
          totalAmount,
          status: 'Processing',
        },
      });

      // 3. Siapkan dan buat semua OrderItem terkait
      const orderItemsData = cartItems.map((item: CartItem) => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // 4. Kurangi stok setiap produk
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json({ success: true, message: 'Pesanan berhasil dibuat!', order: newOrder }, { status: 201 });

  } catch (error: any) {
    console.error("API Create Order Error:", error);
    // Kirim pesan error spesifik jika stok tidak cukup
    if (error.message.includes('Stok untuk produk')) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal membuat pesanan.' }, { status: 500 });
  }
}