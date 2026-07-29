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
