import { LuArrowUp } from 'react-icons/lu';

const ActivityCard = () => {
  return (
    <div className="flex justify-between items-center gap-1 p-2 border-b hover:bg-slate-50 cursor-pointer group">
      <div className="flex items-start gap-1">
        <p className="flex gap-1 items-center text-green-600">
          <LuArrowUp size={20} />
        </p>

        <div>
          <p className="text-green-600 font-semibold">Sendok</p>
          <p className="text-xs">2 hours ago</p>
        </div>
      </div>
      <p className="text-green-600 font-semibold">+10 items</p>
    </div>
  );
};

export default ActivityCard;
