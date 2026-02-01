import { LuSearch } from 'react-icons/lu';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { useEffect, useState } from 'react';

const SearchInput = ({ setState }: { setState: React.Dispatch<React.SetStateAction<string>> }) => {
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    const searchTimeout = setTimeout(() => setState(input), 300);
    return () => clearTimeout(searchTimeout);
  }, [input]);

  return (
    <InputGroup className="bg-white max-w-[30%]">
      <InputGroupInput placeholder="Search..." onChange={(e) => setInput(e.target.value)} />

      <InputGroupAddon>
        <LuSearch />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchInput;
