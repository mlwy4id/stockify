import { LuClock } from 'react-icons/lu';

const EmptyRecentTransaction = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <LuClock size={40} />
      <div className="text-center">
        <p>No activity recorded today</p>
        <p>Start adding transaction to see activity here</p>
      </div>
    </div>
  );
};

export default EmptyRecentTransaction;
