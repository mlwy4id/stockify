import { LuSearchX } from 'react-icons/lu';

const SearchNotFound = ({ message }: { message: string }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 py-10">
      <LuSearchX size={56} />
      <div className="text-center">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SearchNotFound;
