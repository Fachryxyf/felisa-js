// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({ data: { name: 'Admin Ayud Craft', email: 'admin@gmail.com', password: hashedPassword }});

  const bucketBunga = await prisma.product.create({ data: { name: 'Bucket Bunga' }});
  const bucketUang = await prisma.product.create({ data: { name: 'Bucket Uang' }});
  const bucketBarang = await prisma.product.create({ data: { name: 'Bucket Barang' }});
  const custom = await prisma.product.create({ data: { name: 'Custom' }});

  // Buat contoh ulasan dengan nilai per kriteria
  // Data ini meniru matriks awal dari skripsi Anda
  await prisma.review.create({
    data: {
      comment: 'Ulasan untuk Bucket Bunga.',
      userId: adminUser.id, productId: bucketBunga.id,
      ratingWaktu: 4, ratingHarga: 4, ratingBahan: 2, ratingDesain: 5, ratingPackaging: 4,
    }
  });

  await prisma.review.create({
    data: {
      comment: 'Ulasan untuk Bucket Uang.',
      userId: adminUser.id, productId: bucketUang.id,
      ratingWaktu: 4, ratingHarga: 3, ratingBahan: 5, ratingDesain: 4, ratingPackaging: 2,
    }
  });

   await prisma.review.create({
    data: {
      comment: 'Ulasan untuk Bucket Barang.',
      userId: adminUser.id, productId: bucketBarang.id,
      ratingWaktu: 2, ratingHarga: 4, ratingBahan: 3, ratingDesain: 5, ratingPackaging: 5,
    }
  });

  await prisma.review.create({
    data: {
      comment: 'Ulasan untuk Custom.',
      userId: adminUser.id, productId: custom.id,
      ratingWaktu: 4, ratingHarga: 3, ratingBahan: 4, ratingDesain: 5, ratingPackaging: 2,
    }
  });

  console.log('Seeding finished.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });