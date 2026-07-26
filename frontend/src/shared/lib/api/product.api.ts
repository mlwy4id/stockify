import type { CreateProduct, UpdateProduct } from '@/shared/types/product.type';
import api from '../axios/axios';

export const getAllProducts = async () => {
  const res = await api.get('product/');
  return res.data.products ?? [];
};

export const getProduct = async (id: string) => {
  const res = await api.get(`product/${id}`);
  return res.data.product;
};

export const createProduct = async (product: CreateProduct) => {
  const res = await api.post('product/', product);
  return res.data;
};

export const updateProduct = async ({ id, ...product }: UpdateProduct & { id: string }) => {
  const res = await api.patch(`product/${id}`, product);
  return res.data;
};

export const archiveProduct = async (id: string) => {
  const res = await api.patch(`product/${id}/archive`);
  return res.data;
};

export const reactivateProduct = async (id: string) => {
  const res = await api.patch(`product/${id}/reactivate`);
  return res.data;
};
