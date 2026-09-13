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
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import type { Category } from '@/shared/types/category.type';

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  categories: Category[];
  categoryValue: string | null;
  onCategoryChange: (id: string | null) => void;
  status: 'active' | 'archived';
  onStatusChange: (status: 'active' | 'archived') => void;
};

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'archived', label: 'Diarsipkan' },
] as const;

const ProductFilters = ({
  setSearchValue,
  categories,
  categoryValue,
  onCategoryChange,
  status,
  onStatusChange,
}: Props) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
      <SearchInput setState={setSearchValue} />
      <div className="flex items-center gap-2">
        <Tabs
          value={status}
          onValueChange={(value) => onStatusChange(value as 'active' | 'archived')}
        >
          <TabsList className="bg-muted rounded-md">
            {statusOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="w-24">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
    </div>
  );
};

export default ProductFilters;
