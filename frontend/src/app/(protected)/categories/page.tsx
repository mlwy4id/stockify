'use client';
import PageLayout from '@/shared/components/layout/PageLayout';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import CreateCategoryForm from '@/features/category/containers/CreateCategoryForm';
import EditCategoryForm from '@/features/category/containers/EditCategoryForm';
import ConfirmDeleteCategoryModal from '@/features/category/containers/ConfirmDeleteCategoryModal';
import CategoryCardsContainer from '@/features/category/containers/CategoryCardsContainer';
import { useGetCategories } from '@/features/category/hooks/queries/category.query';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

type DialogType = 'create-category' | 'rename-category' | 'delete-category' | null;

export default function CategoriesPage() {
  const [isCategoriesDataAvailable, setCategoriesDataAvailability] = useState<boolean>(true);
  const [dialog, setDialog] = useState<{ type: DialogType; categoryId?: string }>({ type: null });
  const { data: categories } = useGetCategories();

  const selectedCategory = categories?.find((c) => c.id === dialog.categoryId);

  const openDialog = (type: DialogType, categoryId?: string) => setDialog({ type, categoryId });
  const closeDialog = () => setDialog({ type: null });

  return (
    <PageLayout title="Categories" onAddClick={() => openDialog('create-category')}>
      <Card
        className={cn(
          'bg-muted border-0 shadow-none',
          isCategoriesDataAvailable ? 'h-[70vh]' : 'h-full'
        )}
      >
        <CardContent className="h-full px-0 flex flex-col gap-2">
          <CategoryCardsContainer
            setCategoriesDataAvailability={setCategoriesDataAvailability}
            onEdit={(id) => openDialog('rename-category', id)}
            onDelete={(id) => openDialog('delete-category', id)}
          />
        </CardContent>
      </Card>

      <Dialog
        open={dialog.type === 'create-category'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <CreateCategoryForm onSuccess={closeDialog} onCancel={closeDialog} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog.type === 'rename-category'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Category</DialogTitle>
          </DialogHeader>
          {dialog.categoryId && (
            <EditCategoryForm categoryId={dialog.categoryId} onSuccess={closeDialog} onCancel={closeDialog} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog.type === 'delete-category'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
          </DialogHeader>
          {dialog.categoryId && selectedCategory && (
            <ConfirmDeleteCategoryModal
              categoryId={dialog.categoryId}
              categoryName={selectedCategory.name}
              onSuccess={closeDialog}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
