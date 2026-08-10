import type { SoldBrokenRatioRange, VolumeRange } from '@/shared/types/product.type';

export type StockMovementAction = 'RESTOCK' | 'REFUND' | 'SOLD' | 'BROKEN';

export type StockMovement = {
  id: string;
  action: StockMovementAction;
  quantity: number;
  source?: string;
  reason?: string;
  date: string;
};

export type CreateStockMovement = {
  action: StockMovementAction;
  quantity: number;
  source?: string;
  reason?: string;
  date: string;
};

export type StockMovementSummary = {
  productId: string;
  productName: string;
  totalIn: number;
  totalOut: number;
};

export type GlobalStockMovementSummary = {
  totalIn: number;
  totalOut: number;
  productSummaries: StockMovementSummary[];
};

export type DashboardStockMovementSummary = {
  totalIn: number;
  totalOut: number;
  inChangePercentage: number;
  outChangePercentage: number;
  totalActiveProduct: number;
  totalQuantity: number;
  volume: VolumeRange[];
  ratio: SoldBrokenRatioRange[];
};
