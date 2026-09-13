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
import { useRouter } from 'next/navigation';

type Props = {
  id: string;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  categoryName?: string | null;
  isArchived?: boolean;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onReactivate: (id: string) => void;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ProductCard = ({
  id,
  name,
  imageUrl,
  quantity,
  categoryName,
  isArchived,
  onEdit,
  onArchive,
  onReactivate,
}: Props) => {
  const initials = getInitials(name);
  const router = useRouter();

  const goToProduct = () => router.push(`/products/${id}`);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goToProduct}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToProduct();
        }
      }}
      className={cn(
        'group relative w-2xs md:w-60 lg:w-56 2xl:w-76 cursor-pointer transition-shadow hover:shadow-md',
        'py-4 px-8 gap-3 items-center justify-center',
        isArchived && 'opacity-75'
      )}
    >
      {imageUrl ? (
        <div className="flex w-full h-32 rounded-md overflow-hidden bg-primary-subtle">
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <CardHeader className="flex w-full h-32 rounded-md items-center justify-center bg-primary-subtle text-lg font-bold text-primary select-none">
          {initials}
        </CardHeader>
      )}

      <CardContent className="px-0 text-center">
        <span className="block text-sm font-semibold text-foreground leading-tight">
          {nameFormatter(name)}
        </span>
        <span className="block text-xs text-muted-foreground">Stok: {quantity}</span>
        <div className="flex items-center justify-center gap-2 mt-2">
          {categoryName && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary-subtle text-primary">
              {categoryName}
            </span>
          )}
          {isArchived && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
              Diarsipkan
            </span>
          )}
        </div>
      </CardContent>

      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="left" onClick={(e) => e.stopPropagation()}>
          {isArchived ? (
            <DropdownMenuItem onClick={() => onReactivate(id)}>
              Aktifkan kembali
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => onEdit(id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(id)}>Arsipkan</DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default ProductCard;
