'use client';
import SummaryCard from '@/shared/components/SummaryCard';
import { ArrowUp, ArrowDown } from 'lucide-react';

type Props = {
  totalIn: number;
  totalOut: number;
};

const StocksSummaryCard = ({ totalIn, totalOut }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SummaryCard
        icon={ArrowUp}
        cardTitle="Total Restocked Today"
        cardContent={`+${totalIn} items`}
        cardBgColor="bg-green-100"
        cardTitleColor="text-green-700"
        cardContentColor="text-green-800"
      />
      <SummaryCard
        icon={ArrowDown}
        cardTitle="Total Sold Today"
        cardContent={`-${totalOut} items`}
        cardBgColor="bg-red-100"
        cardTitleColor="text-red-700"
        cardContentColor="text-red-800"
      />
    </div>
  );
};

export default StocksSummaryCard;
