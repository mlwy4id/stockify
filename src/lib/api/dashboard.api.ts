import api from '../axios/axios';

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard');
  return res.data;
};
