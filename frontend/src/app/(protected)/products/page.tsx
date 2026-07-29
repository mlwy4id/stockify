'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import ProductCardsContainer from '@/features/products/containers/ProductCardsContainer';
import ProductFilters from '@/features/products/containers/ProductFilters';
import CreateProductForm from '@/features/products/containers/CreateProductForm';
import EditProductForm from '@/features/products/containers/EditProductForm';
import ConfirmArchiveProductModal from '@/features/products/containers/ConfirmArchiveProductModal';
import CreateCategoryForm from '@/features/category/containers/CreateCategoryForm';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type DialogType = 'create-product' | 'edit-product' | 'archive-product' | 'create-category' | null;

export default function ProductPage() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [dialog, setDialog] = useState<{ type: DialogType; productId?: string }>({ type: null });
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryDialogOpen = searchParams.get('category') === 'new';

  const handleCategoryClose = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete('category');
    router.replace(`/products?${newParams.toString()}`);
  };

  const openDialog = (type: DialogType, productId?: string) => setDialog({ type, productId });
  const closeDialog = () => setDialog({ type: null });

  return (
    <PageLayout title="Products" onAddClick={() => openDialog('create-product')}>
      <Card className="h-screen bg-muted border-0 shadow-none">
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <ProductFilters setSearchValue={setSearchValue} />
          <ProductCardsContainer
            searchValue={searchValue}
            onEdit={(id) => openDialog('edit-product', id)}
            onArchive={(id) => openDialog('archive-product', id)}
          />
        </CardContent>
      </Card>

      <Dialog open={dialog.type === 'create-product'} onOpenChange={(open) => !open && closeDialog()}>
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
            <EditProductForm productId={dialog.productId} onSuccess={closeDialog} onCancel={closeDialog} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog.type === 'archive-product'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Product?</DialogTitle>
          </DialogHeader>
          {dialog.productId && (
            <ConfirmArchiveProductModal productId={dialog.productId} onSuccess={closeDialog} onCancel={closeDialog} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={categoryDialogOpen} onOpenChange={(open) => !open && handleCategoryClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <CreateCategoryForm onSuccess={handleCategoryClose} onCancel={handleCategoryClose} />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
