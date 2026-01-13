import { Skeleton } from '../ui/skeleton';

const TableSkeleton = () => {
  return (
    <table className="w-full flex flex-col gap-5">
      <thead>
        <Skeleton className="py-4 px-4" />
      </thead>
      <tbody className="flex flex-col gap-4">
        <tr className="grid grid-cols-3 gap-3">
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
        </tr>
        <tr className="grid grid-cols-3 gap-3">
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
        </tr>
        <tr className="grid grid-cols-3 gap-3">
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
        </tr>
        <tr className="grid grid-cols-3 gap-3">
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
          <td>
            <Skeleton className="py-3 px-4" />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableSkeleton;
