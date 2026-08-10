import type { CreateStockMovement } from '@/shared/types/stock-movement.type';
import api from '../axios/axios';

export const createStockMovement = async (productId: string, movement: CreateStockMovement) => {
  const res = await api.post(`product/${productId}/stock-movements/`, movement);
  return res.data;
};

export const getStockMovementsByProduct = async (productId: string) => {
  const res = await api.get(`product/${productId}/stock-movements/`);
  return res.data.movements ?? [];
};

export const getStockMovementSummaryByProduct = async (productId: string, dateFilter?: string) => {
  const res = await api.get(`product/${productId}/stock-movements/summary`, {
    params: dateFilter ? { dateFilter } : {},
  });
  return res.data.summary;
};

export const getDashboardStockMovementSummary = async () => {
  const res = await api.get('stock-movements/');
  return res.data.summary;
};

export const getGlobalStockChart = async (range?: string) => {
  const res = await api.get('stock-movements/chart', {
    params: range ? { range } : undefined,
  });
  return res.data.chart;
};

export const getTopMovers = async (limit?: number, dateFilter?: string) => {
  const res = await api.get('stock-movements/top-movers', {
    params: {
      ...(limit ? { limit } : {}),
      ...(dateFilter ? { dateFilter } : {}),
    },
  });
  return res.data.movers ?? [];
};
