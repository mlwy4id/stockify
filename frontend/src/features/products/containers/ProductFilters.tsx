'use client';
import SearchInput from '@/shared/components/filters/SearchInput';

type Props = {
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
};

const ProductFilters = ({ setSearchValue }: Props) => {
  return (
    <div className="flex justify-between w-full">
      <SearchInput setState={setSearchValue} />
    </div>
  );
};

export default ProductFilters;
