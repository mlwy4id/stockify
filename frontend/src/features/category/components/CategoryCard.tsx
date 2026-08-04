'use client';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Card, CardContent } from '@/shared/components/ui/card';
import { EllipsisVertical } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type Props = {
  id: string;
  name: string;
  productCount: number;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const CategoryCard = ({ id, name, productCount, onClick, onEdit, onDelete }: Props) => {
  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-shadow hover:shadow-md',
        'py-4 px-6 gap-0'
      )}
    >
      <CardContent
        onClick={() => onClick(id)}
        className="px-0 py-0 flex flex-col items-start gap-3"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary-subtle text-sm font-bold text-primary select-none">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-foreground truncate">{nameFormatter(name)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {productCount} Product{productCount <= 1 ? '' : 's'}
        </p>
      </CardContent>

      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="bottom">
          <DropdownMenuItem onClick={() => onEdit(id)}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete(id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default CategoryCard;
