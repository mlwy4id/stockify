import { Skeleton } from '../ui/skeleton';

const TableSkeleton = () => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          {Array.from({ length: 4 }).map((_, i) => (
            <th key={i} className="px-4 py-2">
              <Skeleton className="h-4 w-full" />
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: 20 }).map((_, row) => (
          <tr key={row}>
            {Array.from({ length: 4 }).map((_, col) => (
              <td key={col} className="px-4 py-3">
                <Skeleton className="h-4 w-full" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
