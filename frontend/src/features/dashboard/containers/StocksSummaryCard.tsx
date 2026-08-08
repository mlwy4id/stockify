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
        stripColor="bg-success"
        cardTitleColor="text-success"
        cardContentColor="text-success"
      />
      <SummaryCard
        icon={ArrowDown}
        cardTitle="Total Sold Today"
        cardContent={`-${totalOut} items`}
        stripColor="bg-neutral-action"
        cardTitleColor="text-neutral-action"
        cardContentColor="text-neutral-action"
      />
    </div>
  );
};

export default StocksSummaryCard;
