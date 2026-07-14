import { Months } from '@/shared/constants/months';

export const useGetCurrentMonthAndYear = () => {
  const currentMonth = Months.find((month) => {
    return month.id === new Date().getMonth();
  });

  if (currentMonth === undefined) {
    throw new Error();
  }

  const currentMonthName = currentMonth.name;
  const currentYear = String(new Date().getFullYear());

  return {
    currentMonthName,
    currentYear,
  };
};
