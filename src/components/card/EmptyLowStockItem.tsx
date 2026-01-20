import { LuPackageCheck } from 'react-icons/lu';

const EmptyLowStockItem = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <LuPackageCheck size={40} />
      <div className="text-center">
        <p>All items are sufficiently stocked</p>
        <p>There are no items running low at the moment</p>
      </div>
    </div>
  );
};

export default EmptyLowStockItem;
