// app/api/produk/route.ts
import { NextResponse } from 'next/server';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import prisma from '../../../lib/prisma';

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("API GET Products Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data produk." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const image = formData.get('image') as File;

    if (!name || !price || !stock || !image) {
      return NextResponse.json({ message: "Nama, harga, stok, dan gambar produk wajib diisi." }, { status: 400 });
    }

    // 1. Ubah file gambar menjadi buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Upload gambar ke Cloudinary
    const uploadResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
        if (err) reject(err);
        resolve(result);
      }).end(buffer);
    });

    const imageUrl = uploadResult?.secure_url;
    if (!imageUrl) {
        throw new Error("Gagal mendapatkan URL gambar dari Cloudinary.");
    }

    // 3. Simpan produk baru ke database
    const newProduct = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
        imageUrl: imageUrl,
      },
    });

    return NextResponse.json({ success: true, message: "Produk berhasil ditambahkan.", product: newProduct }, { status: 201 });

  } catch (error) {
    console.error("API Create Product Error:", error);
    return NextResponse.json({ message: "Gagal menambahkan produk." }, { status: 500 });
  }
}