import api from '../axios/axios';

export const getReportsData = async (month?: string, year?: string) => {
  const res = await api.get('/reports', {
    params: { month, year },
  });
  return res.data.data;
};
