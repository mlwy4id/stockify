import ProductPage from '@/features/products/pages/page';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductPage />
      {children}
    </>
  );
}
