import InventoryPage from '@/features/inventory/pages/page';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InventoryPage />
      {children}
    </>
  );
}
