import { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  totalPage: number;
};

const Pagination = ({ totalPage }: Props) => {
  const windowSize = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

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
        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
      />
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? 'default' : 'outline'}
          onClick={() => setCurrentPage(p)}
          className="cursor-pointer"
        >
          {p}
        </Button>
      ))}
      <ChevronRight
        size={24}
        onClick={() => setCurrentPage(currentPage < totalPage ? currentPage + 1 : currentPage)}
      />
    </div>
  );
};

export default Pagination;
