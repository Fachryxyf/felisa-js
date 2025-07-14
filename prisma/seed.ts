// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');
  
  // Hapus data lama dengan urutan yang benar
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.passwordResetToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});

  // Buat User Admin (tanpa menyimpan ke variabel)
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin Ayud Craft',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Buat Produk
  const bucketBunga = await prisma.product.create({
    data: {
      name: 'Bucket Bunga',
      description: 'Rangkaian bunga mawar segar dengan sentuhan baby breath.',
      price: 150000,
      stock: 20,
      imageUrl: '/images/bucket bunga pict.png',
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bucket Uang',
      description: 'Bucket unik berisi lembaran uang yang dibentuk menjadi bunga.',
      price: 100000,
      stock: 15,
      discountPrice: 85000,
      imageUrl: '/images/bucket uang 2.jpg',
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bucket Barang',
      description: 'Kumpulan snack dan barang-barang kecil favorit Anda.',
      price: 125000,
      stock: 30,
      imageUrl: '/images/bucket snack pict.png',
    },
  });

  await prisma.product.create({
    data: {
      name: 'Custom',
      description: 'Wujudkan bucket impian Anda sendiri. Hubungi kami untuk detail.',
      price: 0,
      stock: 99,
      imageUrl: '/images/bucket custom pict.png',
    },
  });

  // Buat contoh Review
  await prisma.review.create({
    data: {
      reviewerName: 'Felisa',
      comment: 'Sangat Cantik!',
      productId: bucketBunga.id,
      ratingWaktu: 5, ratingHarga: 4, ratingBahan: 5, ratingDesain: 5, ratingPackaging: 4,
    },
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