'use client';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

type Props = {
  id: string;
  name: string;
  quantity: number;
  openEditModal: (id: string) => void;
  openArchiveModal: (id: string) => void;
};

const ProductCard = ({
  id,
  name,
  quantity,
  openEditModal,
  openArchiveModal,
}: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-gray-900">{nameFormatter(name)}</span>
        <span className="text-sm text-gray-500">Stock: {quantity}</span>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="left">
            <DropdownMenuItem onClick={() => openEditModal(id)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openArchiveModal(id)}>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProductCard;
