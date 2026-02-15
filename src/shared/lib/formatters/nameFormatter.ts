export const nameFormatter = (name: string) => {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
};
