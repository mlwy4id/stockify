import { nameFormatter } from '@/lib/formatters/nameFormatter';
import type { Reports } from '@/types/report.type';

type Props = {
  reportsData: Reports[];
};

const ReportsTable = ({ reportsData }: Props) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left py-3 px-4 font-semibold">Item Name</th>
          <th className="text-left py-3 px-4 font-semibold">Restock</th>
          <th className="text-left py-3 px-4 font-semibold">Sold</th>
        </tr>
      </thead>
      <tbody>
        {reportsData.map((report) => (
          <tr key={report.id} className="hover:bg-slate-50 cursor-pointer group">
            <td className="py-3 px-4">{nameFormatter(report.itemName)}</td>
            <td className="py-3 px-4">{report.restock}</td>
            <td className="py-3 px-4">{report.sold}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportsTable;
