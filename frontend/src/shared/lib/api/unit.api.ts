import type { CreateUnit } from '@/shared/types/unit.type';
import api from '../axios/axios';

export const getUnits = async () => {
  const res = await api.get('unit');
  return res.data.data ?? null;
};

export const createUnit = async (unit: CreateUnit) => {
  const res = await api.post('unit', unit);
  return res.data;
};
