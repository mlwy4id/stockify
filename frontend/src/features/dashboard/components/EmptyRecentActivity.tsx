'use client';
import { Clock } from 'lucide-react';

const EmptyRecentActivity = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <Clock size={40} />
      <div className="text-center">
        <p>No activity recorded today</p>
        <p>Start adding transaction to see activity here</p>
      </div>
    </div>
  );
};

export default EmptyRecentActivity;
