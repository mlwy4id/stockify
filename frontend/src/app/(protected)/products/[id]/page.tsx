'use client';
import { useParams } from 'next/navigation';
import PageLayout from '@/shared/components/layout/PageLayout';
import ProductDetailContainer from '@/features/products/detail/containers/ProductDetailContainer';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageLayout title='Product Detail'>
      <ProductDetailContainer id={id} />
    </PageLayout>
  );
}
