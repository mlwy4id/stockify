import { LuReceiptText } from 'react-icons/lu';

const EmptyTransactionCard = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <LuReceiptText size={56} />
      <div className="text-center">
        <p>No transaction yet</p>
        <p>Start by adding your first transaction</p>
      </div>
    </div>
  );
};

export default EmptyTransactionCard;
