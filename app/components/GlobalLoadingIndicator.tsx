// app/components/GlobalLoadingIndicator.tsx
'use client';

import { useLoading } from '../context/LoadingContext'; // Path disesuaikan
import LoadingSpinner from './LoadingSpinner'; // Path disesuaikan

export default function GlobalLoadingIndicator() {
  const { isLoading } = useLoading();

  // Tampilkan spinner hanya jika state isLoading true
  return isLoading ? <LoadingSpinner /> : null;
}