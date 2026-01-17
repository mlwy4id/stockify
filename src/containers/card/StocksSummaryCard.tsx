import SummaryCard from '@/components/card/SummaryCard';
import { LuArrowUp, LuArrowDown, LuDiff } from 'react-icons/lu';

type Props = {
  itemRestock: number;
  itemSold: number;
  itemNet: number;
};

const StocksSummaryCard = ({ itemRestock, itemSold, itemNet }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <SummaryCard
        icon={LuArrowUp}
        cardTitle="Total Restocked Today"
        cardContent={`+ ${itemRestock} items`}
        cardBgColor="bg-green-100"
        cardTitleColor="text-green-700"
        cardContentColor="text-green-800"
      />
      <SummaryCard
        icon={LuArrowDown}
        cardTitle="Total Sold Today"
        cardContent={`- ${itemSold} items`}
        cardBgColor="bg-red-100"
        cardTitleColor="text-red-700"
        cardContentColor="text-red-800"
      />
      <SummaryCard
        icon={LuDiff}
        cardTitle="Net Change"
        cardContent={`${itemNet} items`}
        cardBgColor="bg-blue-100"
        cardTitleColor="text-blue-700"
        cardContentColor="text-blue-800"
      />
    </div>
  );
};

export default StocksSummaryCard;
