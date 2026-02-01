export const dateFormatter = (date: Date) => {
  const isoDate = new Date(date);

  return isoDate.toLocaleDateString('en-EN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
