import { Button } from '@/components/ui/button';

const statusVariants: Record<string, string> = {
  'In Stock': 'bg-green-500',
  'Low Stock': 'bg-yellow-500',
  'Out of Stock': 'bg-red-500',
};

const ItemCard = ({ name = 'Topi', stock = 10, status = 'In Stock' }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col gap-1">
        <span className="text-base font-semibold text-gray-900">{name}</span>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Stock: {stock} items</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs text-white font-medium cursor-pointer
              ${statusVariants[status]}
            `}
        >
          {status}
        </span>

        <Button className="text-black bg-transparent hover:bg-gray-50 cursor-pointer">⋮</Button>
      </div>
    </div>
  );
};

export default ItemCard;
