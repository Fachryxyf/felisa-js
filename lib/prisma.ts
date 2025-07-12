// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Deklarasikan prisma secara global untuk mencegah multiple instance saat hot-reload
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;