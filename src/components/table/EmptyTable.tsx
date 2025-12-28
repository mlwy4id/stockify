import { LuBox } from 'react-icons/lu';

const EmptyTable = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <LuBox size={56} />
      <div className="text-center">
        <p>No items yet</p>
        <p>Start by adding your first inventory item</p>
      </div>
    </div>
  );
};

export default EmptyTable;
