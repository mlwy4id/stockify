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
