'use client';
import { ReceiptText } from 'lucide-react';

const EmptyTransactionTable = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <ReceiptText size={56} />
      <div className="text-center">
        <p>Belum ada transaksi</p>
        <p>Mulai dengan menambahkan transaksi pertama</p>
      </div>
    </div>
  );
};

export default EmptyTransactionTable;
