'use client';
import { Tags } from 'lucide-react';

const EmptyCategories = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <Tags size={56} />
      <div className="text-center">
        <p>No categories yet</p>
        <p>Start by adding your first category</p>
      </div>
    </div>
  );
};

export default EmptyCategories;
