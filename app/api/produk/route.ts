// app/api/produk/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'; // Impor tipe UploadApiResponse
import prisma from '../../../lib/prisma';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;

    if (!name || !image) {
      return NextResponse.json({ message: "Nama dan gambar produk wajib diisi." }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ganti 'any' dengan tipe yang lebih spesifik 'UploadApiResponse'
    const uploadResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          reject(err);
        }
        resolve(result);
      }).end(buffer);
    });

    // Ambil URL gambar yang aman dari hasil upload
    const imageUrl = uploadResult?.secure_url;
    if (!imageUrl) {
        throw new Error("Gagal mendapatkan URL gambar dari Cloudinary.");
    }

    // Simpan produk baru ke database
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json({ success: true, message: "Produk berhasil ditambahkan.", product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("API Create Product Error:", error);
    return NextResponse.json({ message: "Gagal menambahkan produk." }, { status: 500 });
  }
}