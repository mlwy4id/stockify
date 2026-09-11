'use client';
import { Tags } from 'lucide-react';

const EmptyCategories = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <Tags size={56} />
      <div className="text-center">
        <p>Belum ada kategori</p>
        <p>Mulai dengan menambahkan kategori pertama</p>
      </div>
    </div>
  );
};

export default EmptyCategories;
