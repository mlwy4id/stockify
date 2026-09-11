'use client';
import SummaryCard from '@/shared/components/SummaryCard';
import { ArrowDown, ArrowUp, Boxes, Package, TrendingDown, TrendingUp } from 'lucide-react';

type Props = {
  totalIn: number;
  totalOut: number;
  inChangePercentage: number;
  outChangePercentage: number;
  totalActiveProduct: number;
  totalQuantity: number;
};

const ChangeBadge = ({ percentage }: { percentage: number }) => {
  const positive = percentage >= 0;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium ${
        positive ? 'text-success' : 'text-danger'
      }`}
    >
      {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      {positive ? '+' : ''}
      {percentage}% dibanding kemarin
    </span>
  );
};

const StocksSummaryCard = ({
  totalIn,
  totalOut,
  inChangePercentage,
  outChangePercentage,
  totalActiveProduct,
  totalQuantity,
}: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <SummaryCard
        icon={ArrowUp}
        cardTitle="Stok Masuk"
        cardContent={`+${totalIn} item`}
        stripColor="bg-success"
        cardTitleColor="text-success"
        cardContentColor="text-success"
        footer={<ChangeBadge percentage={inChangePercentage} />}
      />
      <SummaryCard
        icon={ArrowDown}
        cardTitle="Terjual / Rusak"
        cardContent={`-${totalOut} item`}
        stripColor="bg-danger"
        cardTitleColor="text-danger"
        cardContentColor="text-danger"
        footer={<ChangeBadge percentage={outChangePercentage} />}
      />
      <SummaryCard
        icon={Package}
        cardTitle="Produk Aktif"
        cardContent={`${totalActiveProduct} produk`}
        stripColor="bg-primary"
        cardTitleColor="text-primary"
        cardContentColor="text-primary"
      />
      <SummaryCard
        icon={Boxes}
        cardTitle="Total Stok"
        cardContent={`${totalQuantity} item`}
        stripColor="bg-warning"
        cardTitleColor="text-warning"
        cardContentColor="text-warning"
      />
    </div>
  );
};

export default StocksSummaryCard;
