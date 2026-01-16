import { LuArrowDown, LuArrowUp } from 'react-icons/lu';

type Props = {
  transactionType: string;
  quantity: string;
  createdAt: Date;
  itemName: string;
};

const ActivityCard = ({ transactionType, quantity, createdAt, itemName }: Props) => {
  return (
    <div className="flex justify-between items-center gap-1 p-2 border-b hover:bg-slate-50 cursor-pointer group">
      <div className="flex items-start gap-1">
        {transactionType === 'In' ? (
          <p className="flex gap-1 items-center text-green-600">
            <LuArrowUp size={20} />
          </p>
        ) : (
          <p className="flex gap-1 items-center text-red-600">
            <LuArrowDown size={20} />
          </p>
        )}

        <div>
          <p
            className={
              transactionType === 'In'
                ? `text-green-600 font-semibold`
                : `text-red-600 font-semibold`
            }
          >
            {itemName}
          </p>
          <p className="text-xs">
            {new Date(createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
      <p
        className={
          transactionType === 'In'
            ? `text-green-600 font-semibold min-w-20 text-left`
            : `text-red-600 font-semibold min-w-20 text-left`
        }
      >
        {transactionType === 'In' ? `+${quantity} items` : `-${quantity} items`}
      </p>
    </div>
  );
};

export default ActivityCard;
