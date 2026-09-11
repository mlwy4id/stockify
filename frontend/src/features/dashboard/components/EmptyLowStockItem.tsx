'use client';
import { PackageCheck } from 'lucide-react';

const EmptyLowStockItem = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <PackageCheck size={40} />
      <div className="text-center">
        <p>Semua item tersedia cukup</p>
        <p>Tidak ada item yang stoknya menipis saat ini</p>
      </div>
    </div>
  );
};

export default EmptyLowStockItem;
