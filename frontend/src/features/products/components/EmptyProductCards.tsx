'use client';
import { Box } from 'lucide-react';

const EmptyProductCards = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <Box size={56} />
      <div className="text-center">
        <p>Belum ada produk</p>
        <p>Mulai dengan menambahkan produk pertama</p>
      </div>
    </div>
  );
};

export default EmptyProductCards;
