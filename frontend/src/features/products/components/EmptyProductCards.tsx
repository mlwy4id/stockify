'use client';
import { Box } from 'lucide-react';

const EmptyProductCards = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <Box size={56} />
      <div className="text-center">
        <p>No products yet</p>
        <p>Start by adding your first product</p>
      </div>
    </div>
  );
};

export default EmptyProductCards;
