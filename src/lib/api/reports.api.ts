import api from '../axios/axios';

export const getReportsData = async (month?: string) => {
  const res = await api.get('/reports', {
    params: month ? { month } : undefined,
  });
  return res.data.data;
};
