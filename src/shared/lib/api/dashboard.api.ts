import api from '../axios/axios';

export const getDashboardItemSummary = async () => {
  const res = await api.get('/dashboard/item_summary');
  return res.data.itemSummary;
};

export const getDashboardLowStockItem = async () => {
  const res = await api.get('/dashboard/low_stock');
  return res.data.lowStockItem;
};

export const getDashboardRecentActivity = async () => {
  const res = await api.get('/dashboard/recent_activity');
  return res.data.recentTransactions;
};
