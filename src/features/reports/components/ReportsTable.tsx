import { ItemBadge } from '@/features/inventory';
import { nameFormatter } from '@/shared/lib';
import type { Reports } from '@/shared/types';

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
          <th className="text-left py-3 px-4 font-semibold">Status</th>
        </tr>
      </thead>
      <tbody>
        {reportsData.map((report) => (
          <tr key={report.id} className="hover:bg-slate-50 cursor-pointer group">
            <td className="py-3 px-4">{nameFormatter(report.itemName)}</td>
            <td className="py-3 px-4">{report.restock}</td>
            <td className="py-3 px-4">{report.sold}</td>
            <td className="py-3 px-4">
              <ItemBadge status={report.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReportsTable;
