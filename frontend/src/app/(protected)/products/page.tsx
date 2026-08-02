'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import ProductCardsContainer from '@/features/products/containers/ProductCardsContainer';
import ProductFilters from '@/features/products/containers/ProductFilters';
import CreateProductForm from '@/features/products/containers/CreateProductForm';
import EditProductForm from '@/features/products/containers/EditProductForm';
import ConfirmArchiveProductModal from '@/features/products/containers/ConfirmArchiveProductModal';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

type DialogType = 'create-product' | 'edit-product' | 'archive-product' | null;

export default function ProductPage() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isProductsDataAvailable, setProductsDataAvailability] = useState<boolean>(true);
  const [dialog, setDialog] = useState<{ type: DialogType; productId?: string }>({ type: null });
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('category');
  const { data: categories } = useGetCategories();
  const activeCategory = categories?.find((c) => c.id === categoryId);
  const sortedCategories = [...(categories ?? [])].sort((a, b) => a.name.localeCompare(b.name));

  const setCategoryFilter = (id: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (id) newParams.set('category', id);
    else newParams.delete('category');
    const query = newParams.toString();
    router.replace(query ? `/products?${query}` : '/products');
  };

  const openDialog = (type: DialogType, productId?: string) => setDialog({ type, productId });
  const closeDialog = () => setDialog({ type: null });

  return (
    <PageLayout title="Products" onAddClick={() => openDialog('create-product')}>
      <Card
        className={cn(
          'bg-muted border-0 shadow-none',
          isProductsDataAvailable ? 'h-[70vh]' : 'h-full'
        )}
      >
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <ProductFilters
            setSearchValue={setSearchValue}
            categories={sortedCategories}
            categoryValue={categoryId}
            onCategoryChange={setCategoryFilter}
          />
          <ProductCardsContainer
            searchValue={searchValue}
            categoryId={activeCategory ? categoryId : null}
            setProductsDataAvailability={setProductsDataAvailability}
            onEdit={(id: string) => openDialog('edit-product', id)}
            onArchive={(id: string) => openDialog('archive-product', id)}
          />
        </CardContent>
      </Card>

      <Dialog
        open={dialog.type === 'create-product'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
          </DialogHeader>
          <CreateProductForm onSuccess={closeDialog} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog.type === 'edit-product'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {dialog.productId && (
            <EditProductForm
              productId={dialog.productId}
              onSuccess={closeDialog}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog.type === 'archive-product'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Product?</DialogTitle>
          </DialogHeader>
          {dialog.productId && (
            <ConfirmArchiveProductModal
              productId={dialog.productId}
              onSuccess={closeDialog}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
