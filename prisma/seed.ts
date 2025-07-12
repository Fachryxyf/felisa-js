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
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Ayud Craft',
      email: 'admin@gmail.com',
      password: hashedPassword,
    },
  });

  const bucketBunga = await prisma.product.create({ data: { name: 'Bucket Bunga' }});
  const bucketUang = await prisma.product.create({ data: { name: 'Bucket Uang' }});
  const bucketBarang = await prisma.product.create({ data: { name: 'Bucket Barang' }});

  await prisma.review.create({
    data: {
      comment: 'Bagus sekali, bunganya segar dan desainnya cantik!',
      rating: 5,
      userId: adminUser.id,
      productId: bucketBunga.id,
    }
  });

  await prisma.review.create({
    data: {
      comment: 'Prosesnya cepat dan hasilnya memuaskan. Terima kasih!',
      rating: 4,
      userId: adminUser.id,
      productId: bucketUang.id,
    }
  });

  // TAMBAHKAN REVIEW UNTUK BUCKET BARANG DI SINI
  await prisma.review.create({
    data: {
      comment: 'Isinya lengkap sesuai pesanan, cocok untuk hadiah wisuda.',
      rating: 5,
      userId: adminUser.id,
      productId: bucketBarang.id, // Variabel bucketBarang sekarang digunakan
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });