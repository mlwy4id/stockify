import api from '../axios/axios';

export const getUnits = async () => {
  const res = await api.get('/unit');
  return res.data.data;
};
