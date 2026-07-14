'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '@/shared/types/pagination.type';
import { cn } from '@/shared/lib/utils';

type Props = {
  meta: PaginationMeta;
  setPageFilter: (num: number) => void;
};

const Pagination = ({ meta, setPageFilter }: Props) => {
  const totalPage = meta.totalPage === 0 ? 1 : meta.totalPage;
  const windowSize = 5;

  const [currentPage, setCurrentPage] = useState<number>(meta.page);

  const half = Math.floor(windowSize / 2);

  let startPage = currentPage - half;
  let endPage = currentPage + half;

  if (startPage < 1) {
    startPage = 1;
    endPage = windowSize;
  }

  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = totalPage - windowSize + 1;
  }

  startPage = Math.max(startPage, 1);
  endPage = Math.min(endPage, totalPage);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <ChevronLeft
        size={24}
        onClick={() => {
          setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
          setPageFilter(currentPage > 1 ? currentPage - 1 : currentPage);
        }}
      />
      {pages.map((p) => (
        <Button
          variant="outline"
          key={p}
          onClick={() => {
            setCurrentPage(p);
            setPageFilter(p);
          }}
          className={cn(
            `cursor-pointer`,
            `${currentPage === p ? `bg-blue-600 hover:bg-blue-700 text-white hover:text-white` : ``}`
          )}
        >
          {p}
        </Button>
      ))}
      <ChevronRight
        size={24}
        onClick={() => {
          setCurrentPage(currentPage < totalPage ? currentPage + 1 : currentPage);
          setPageFilter(currentPage < totalPage ? currentPage + 1 : currentPage);
        }}
      />
    </div>
  );
};

export default Pagination;
