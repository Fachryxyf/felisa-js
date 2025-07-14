// app/api/produk/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fungsi GET (tidak berubah)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("API GET Product Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data produk." }, { status: 500 });
  }
}

// Fungsi PATCH (tidak berubah)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const image = formData.get('image') as File | null;

    let imageUrl: string | undefined;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadResult = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        }).end(buffer);
      });
      imageUrl = uploadResult?.secure_url;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        ...(imageUrl && { imageUrl }),
      },
    });

    return NextResponse.json({ success: true, message: "Produk berhasil diperbarui.", product: updatedProduct });
  } catch (error) {
    console.error(`API PATCH Product Error (ID: ${params.id}):`, error);
    return NextResponse.json({ message: "Gagal memperbarui produk." }, { status: 500 });
  }
}

// TAMBAHKAN FUNGSI DELETE INI
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // Sebelum menghapus, kita bisa mengambil data produk untuk menghapus gambar di Cloudinary
    // (Langkah opsional untuk manajemen aset yang lebih baik)
    const product = await prisma.product.findUnique({ where: { id } });
      if (product?.imageUrl) {
        const publicId = product.imageUrl.split('/').pop()?.split('.')[0];
      if(publicId) await cloudinary.uploader.destroy(publicId);
    }

    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error(`API DELETE Product Error (ID: ${params.id}):`, error);
    // Error P2003: Foreign key constraint failed. Terjadi jika produk masih ada di dalam pesanan.
    // Anda bisa tambahkan penanganan error yang lebih spesifik di sini jika perlu.
    return NextResponse.json({ message: 'Gagal menghapus produk. Pastikan produk tidak ada di dalam pesanan manapun.' }, { status: 500 });
  }
}