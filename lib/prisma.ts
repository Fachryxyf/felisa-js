// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Deklarasikan variabel global untuk menampung instance Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Gunakan instance yang sudah ada jika ada, jika tidak, buat yang baru.
// Ini mencegah pembuatan koneksi baru di setiap hot-reload saat pengembangan.
const client = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;