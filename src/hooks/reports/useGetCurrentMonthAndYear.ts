import { Months } from '@/constant/months';

export const useGetCurrentMonthAndYear = () => {
  const currentMonth = Months.find((month) => {
    return month.id === new Date().getMonth();
  });

  const currentMonthName = currentMonth?.name;
  const currentYear = new Date().getFullYear();

  return {
    currentMonthName,
    currentYear,
  };
};
