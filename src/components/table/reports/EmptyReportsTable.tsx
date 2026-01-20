import { LuFileSpreadsheet } from 'react-icons/lu';

const EmptyReportsTable = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <LuFileSpreadsheet size={56} />
      <div className="text-center">
        <p>No reports found</p>
        <p>There are no activities for the selected period</p>
      </div>
    </div>
  );
};

export default EmptyReportsTable;
