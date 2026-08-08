export type Product = {
  id: string;
  name: string;
  quantity: number;
  categoryId: string | null;
};

export type CreateProduct = {
  name: string;
  quantity: number;
  stockThreshold: number;
  categoryId?: string;
};

export type UpdateProduct = {
  name?: string;
  stockThreshold?: number;
  categoryId?: string;
};

export type VolumeRange = {
  range: string;
  totalIn: number;
  totalOut: number;
};

export type SoldBrokenRatioRange = {
  range: string;
  totalSold: number;
  totalBroken: number;
  soldPercentage: number;
  brokenPercentage: number;
};

export type DepletionPrediction = {
  avgDailyOut?: number;
  daysLeft?: number;
  estimatedDate?: string;
};

export type RestockInterval = {
  restockCount: number;
  avgRestockIntervalDays?: number;
};

export type ProductDashboard = {
  productId?: string;
  productName?: string;
  currentStock: number;
  stockThreshold?: number;
  categoryId?: string;
  volume: VolumeRange[];
  ratio: SoldBrokenRatioRange[];
  depletion: DepletionPrediction;
  restockInterval: RestockInterval;
};

export type StockChartPoint = {
  date: string;
  quantity: number;
};

export type ProductStockChart = {
  productId?: string;
  productName?: string;
  points: StockChartPoint[];
};
