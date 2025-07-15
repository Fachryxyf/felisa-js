// app/admin/dashboard/page.tsx
import prisma from '../../../lib/prisma';
import { Product } from '@prisma/client';
import DashboardClient from './DashboardClient';
import { format } from 'date-fns';

const getSawRank = async () => {
    // Fungsi ini sama persis seperti di halaman Analisis SAW
    const products: Product[] = await prisma.product.findMany();
    const reviews = await prisma.review.findMany();
    if (products.length === 0 || reviews.length === 0) return [];

    const criteria = [ { key: 'ratingWaktu', weight: 0.10 }, { key: 'ratingHarga', weight: 0.30 }, { key: 'ratingBahan', weight: 0.15 }, { key: 'ratingDesain', weight: 0.40 }, { key: 'ratingPackaging', weight: 0.05 },];
    const productRatings: { [key: number]: any } = {};
    products.forEach(p => { productRatings[p.id] = { name: p.name, ...Object.fromEntries(criteria.map(c => [c.key, { sum: 0, count: 0 }])) }; });
    reviews.forEach(review => { const pr = productRatings[review.productId]; if (pr) { criteria.forEach(c => { pr[c.key].sum += review[c.key as keyof typeof review]; pr[c.key].count++; }); } });
    const ratingsMatrix = products.map(p => { const ratings = productRatings[p.id]; return criteria.map(c => (ratings[c.key].count > 0 ? ratings[c.key].sum / ratings[c.key].count : 0)); });
    let maxVals = criteria.map((_, j) => Math.max(...ratingsMatrix.map(row => row[j])));
    const normalizedMatrix = ratingsMatrix.map(row => row.map((val, j) => (maxVals[j] > 0 ? val / maxVals[j] : 0)));
    const finalScores = normalizedMatrix.map(row => row.reduce((score, val, j) => score + val * criteria[j].weight, 0));
    return products.map((alt, i) => ({ name: alt.name, score: finalScores[i] })).sort((a, b) => b.score - a.score);
};

const getOrderTrend = async () => {
    // ... (Fungsi getOrderTrend tidak berubah)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const orders = await prisma.order.findMany({ where: { orderDate: { gte: sevenDaysAgo } }, orderBy: { orderDate: 'asc' },});
    const dailyCounts: { [key: string]: number } = {};
    for (let i = 0; i < 7; i++) { const date = new Date(); date.setDate(date.getDate() - i); const formattedDate = format(date, 'MMM d'); dailyCounts[formattedDate] = 0; }
    orders.forEach(order => { const formattedDate = format(order.orderDate, 'MMM d'); if (dailyCounts.hasOwnProperty(formattedDate)) { dailyCounts[formattedDate]++; } });
    return Object.entries(dailyCounts).map(([date, count]) => ({ date, count })).reverse();
};

export default async function DashboardPage() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    sawRank, // sawRank sekarang adalah array
    orderTrend,
    lowStockProducts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    getSawRank(),
    getOrderTrend(),
    prisma.product.findMany({ where: { stock: { lt: 5 } }, orderBy: { stock: 'asc' } })
  ]);
  
  return (
    <DashboardClient 
      totalUsers={totalUsers}
      totalProducts={totalProducts}
      totalOrders={totalOrders}
      sawRank={sawRank} // Kirim seluruh data peringkat
      orderTrend={orderTrend}
      lowStockProducts={lowStockProducts}
    />
  );
}