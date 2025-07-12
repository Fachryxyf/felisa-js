#!/bin/sh
tsc prisma/seed.ts --outDir prisma/dist
node prisma/dist/seed.js