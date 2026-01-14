import SummaryCard from '@/components/card/SummaryCard';
import { LuArrowUp, LuArrowDown, LuDiff } from 'react-icons/lu';

type Props = {
  itemIn: number;
  itemOut: number;
  itemNet: number;
};

const StocksSummaryCard = ({ itemIn, itemOut, itemNet }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <SummaryCard
        icon={LuArrowUp}
        cardTitle="Today Item In"
        cardContent={`${itemIn} item`}
        cardBgColor="bg-green-100"
        cardTitleColor="text-green-700"
        cardContentColor="text-green-800"
      />
      <SummaryCard
        icon={LuArrowDown}
        cardTitle="Today Item Out"
        cardContent={`${itemOut} item`}
        cardBgColor="bg-red-100"
        cardTitleColor="text-red-700"
        cardContentColor="text-red-800"
      />
      <SummaryCard
        icon={LuDiff}
        cardTitle="Net Change"
        cardContent={`${itemNet} item`}
        cardBgColor="bg-blue-100"
        cardTitleColor="text-blue-700"
        cardContentColor="text-blue-800"
      />
    </div>
  );
};

export default StocksSummaryCard;
