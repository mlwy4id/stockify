import type { CreateCategory } from '@/shared/types/category.type';
import api from '../axios/axios';

export const getAllCategories = async () => {
  const res = await api.get('category/');
  return res.data.data ?? [];
};

export const createCategory = async (category: CreateCategory) => {
  const res = await api.post('category/', category);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`category/${id}/`);
  return res.data;
};

export const renameCategory = async ({ id, name }: { id: string; name: string }) => {
  const res = await api.patch(`category/${id}/`, { name });
  return res.data;
};
