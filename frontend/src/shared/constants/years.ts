const currentYear = new Date().getFullYear();

export const Years = Array.from({ length: 5 }, (_, i) => {
  const year = String(currentYear - i);
  return {
    id: i,
    name: year,
  };
});
