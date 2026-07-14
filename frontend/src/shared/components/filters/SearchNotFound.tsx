'use client';
import { SearchX } from 'lucide-react';

const SearchNotFound = ({ message }: { message: string }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-10">
      <SearchX size={56} />
      <div className="text-center">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SearchNotFound;
