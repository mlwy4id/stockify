export const isoDateFormatter = (date: string) => {
  return new Date(date).toISOString().split('T')[0];
};
