'use client';
import { useParams } from 'next/navigation';
import PageLayout from '@/shared/components/layout/PageLayout';
import { nameFormatter } from '@/shared/lib/formatters/nameFormatter';
import ProductDetailContainer from '@/features/products/detail/containers/ProductDetailContainer';
import { useGetProductDashboard } from '@/features/products/detail/hooks/queries/product-detail.query';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dashboard } = useGetProductDashboard(id);
  const title = dashboard?.productName ? nameFormatter(dashboard.productName) : 'Product Detail';

  return (
    <PageLayout title={title}>
      <ProductDetailContainer id={id} />
    </PageLayout>
  );
}
