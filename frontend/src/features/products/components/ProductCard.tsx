'use client';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type Props = {
  id: string;
  name: string;
  quantity: number;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ProductCard = ({ id, name, quantity, onEdit, onArchive }: Props) => {
  const initials = getInitials(name);

  return (
    <Card
      className={cn(
        'group relative w-2xs cursor-pointer transition-shadow hover:shadow-md',
        'py-4 px-8 gap-3 items-center justify-center'
      )}
    >
      <CardHeader className="flex w-full h-32 rounded-md items-center justify-center bg-indigo-100 text-lg font-bold text-indigo-600 select-none">
        {initials}
      </CardHeader>

      <CardContent className="px-0 text-center">
        <span className="block text-sm font-semibold text-gray-900 leading-tight">
          {nameFormatter(name)}
        </span>
        <span className="block text-xs text-gray-500">Stock: {quantity}</span>
      </CardContent>

      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="left">
          <DropdownMenuItem onClick={() => onEdit(id)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onArchive(id)}>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default ProductCard;
