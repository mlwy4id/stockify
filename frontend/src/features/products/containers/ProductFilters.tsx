'use client';
import SearchInput from '@/shared/components/filters/SearchInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import type { Category } from '@/shared/types/category.type';

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[];
  categoryValue: string | null;
  onCategoryChange: (id: string | null) => void;
};

const ProductFilters = ({ setSearchValue, categories, categoryValue, onCategoryChange }: Props) => {
  return (
    <div className="flex justify-between items-center gap-2">
      <SearchInput setState={setSearchValue} />
      <Select
        value={categoryValue ?? 'all'}
        onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
      >
        <SelectTrigger className="w-48 bg-background shadow-sm rounded-md font-medium">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Kategori</SelectLabel>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {nameFormatter(category.name)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductFilters;
