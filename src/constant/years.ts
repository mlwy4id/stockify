const currentYear = new Date().getFullYear();

export const Years = Array.from({ length: 5 }, (_, i) => currentYear - i);
