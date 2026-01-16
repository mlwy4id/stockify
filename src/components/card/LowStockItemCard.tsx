type Props = {
  itemName: string;
  quantity: string | undefined;
};

const LowStockItemCard = ({ itemName, quantity }: Props) => {
  return (
    <div className="flex-col items-center gap-4 p-2 border-l-yellow-400 border-l-4 hover:bg-yellow-50 cursor-pointer group">
      <p className="text-md font-semibold text-yellow-500">{itemName}</p>
      <p className="text-xs">
        {quantity} {Number(quantity) <= 1 ? `item` : `items`} remaining
      </p>
    </div>
  );
};

export default LowStockItemCard;
