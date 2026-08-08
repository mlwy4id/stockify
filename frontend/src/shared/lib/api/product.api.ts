import type { CreateProduct, Product, UpdateProduct } from '@/shared/types/product.type';
import api from '../axios/axios';

export const getAllProducts = async () => {
  const res = await api.get('product/');
  return res.data.products ?? [];
};

export const getLowStockProducts = async () => {
  const res = await api.get('product/low-stock');
  return res.data.products ?? [];
};

export const getProduct = async (id: string) => {
  const res = await api.get(`product/${id}/dashboard`);
  const dashboard = res.data.data;
  const product: Product = {
    id: dashboard.productId,
    name: dashboard.productName,
    quantity: dashboard.currentStock,
    categoryId: dashboard.categoryId ?? null,
  };
  return product;
};

export const getProductDashboard = async (id: string) => {
  const res = await api.get(`product/${id}/dashboard`);
  return res.data.data;
};

export const getProductChart = async (id: string, range?: string) => {
  const res = await api.get(`product/${id}/chart`, {
    params: range ? { range } : undefined,
  });
  return res.data.chart;
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
