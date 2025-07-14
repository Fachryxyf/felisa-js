// prisma/seed.ts

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin Ayud Craft',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const bucketBunga = await prisma.product.create({ data: { name: 'Bucket Bunga' } });
  // Hapus 'const _...' karena variabel tidak digunakan
  await prisma.product.create({ data: { name: 'Bucket Uang' } });
  await prisma.product.create({ data: { name: 'Bucket Barang' } });
  await prisma.product.create({ data: { name: 'Custom' } });

  await prisma.review.create({
    data: {
      reviewerName: 'Felisa',
      comment: 'Sangat Cantik!',
      productId: bucketBunga.id,
      ratingWaktu: 5, ratingHarga: 4, ratingBahan: 5, ratingDesain: 5, ratingPackaging: 4,
    }
  });

  // Hapus 'const _...' karena variabel tidak digunakan
  await prisma.order.create({
    data: {
      customerName: 'Budi Hartono',
      totalAmount: 150000,
      status: 'Completed',
      userId: adminUser.id,
      items: {
        create: [
          { productId: bucketBunga.id, quantity: 1 },
        ]
      }
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