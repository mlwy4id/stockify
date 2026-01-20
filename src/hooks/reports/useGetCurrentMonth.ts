import { Months } from '@/constant/month';

export const useGetCurrentMonth = () => {
  const currentMonth = Months.find((month) => {
    return month.id === new Date().getMonth();
  });

  return currentMonth?.name;
};
