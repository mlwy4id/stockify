import SummaryCard from '@/components/card/SummaryCard';
import { LuArrowUp, LuArrowDown, LuDiff } from 'react-icons/lu';

const ReportsSummaryCard = () => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <SummaryCard
        icon={LuArrowUp}
        cardTitle="Today Item In"
        cardContent="0 item"
        cardBgColor="bg-green-100"
        cardTitleColor="text-green-700"
        cardContentColor="text-green-800"
      />
      <SummaryCard
        icon={LuArrowDown}
        cardTitle="Today Item Out"
        cardContent="0 item"
        cardBgColor="bg-red-100"
        cardTitleColor="text-red-700"
        cardContentColor="text-red-800"
      />
      <SummaryCard
        icon={LuDiff}
        cardTitle="Net Change"
        cardContent="0 item"
        cardBgColor="bg-blue-100"
        cardTitleColor="text-blue-700"
        cardContentColor="text-blue-800"
      />
    </div>
  );
};

export default ReportsSummaryCard;
