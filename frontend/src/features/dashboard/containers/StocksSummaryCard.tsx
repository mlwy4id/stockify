'use client';
import SummaryCard from '@/shared/components/SummaryCard';
import { ArrowUp, ArrowDown } from 'lucide-react';

type Props = {
  itemRestock: number;
  itemSold: number;
};

const StocksSummaryCard = ({ itemRestock, itemSold }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SummaryCard
        icon={ArrowUp}
        cardTitle="Total Restocked Today"
        cardContent={`+${itemRestock} items`}
        cardBgColor="bg-green-100"
        cardTitleColor="text-green-700"
        cardContentColor="text-green-800"
      />
      <SummaryCard
        icon={ArrowDown}
        cardTitle="Total Sold Today"
        cardContent={`-${itemSold} items`}
        cardBgColor="bg-red-100"
        cardTitleColor="text-red-700"
        cardContentColor="text-red-800"
      />
    </div>
  );
};

export default StocksSummaryCard;
