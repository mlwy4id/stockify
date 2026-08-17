import type { Product, UpdateProduct } from '@/shared/types/product.type';
import { getProductUploadUrl, uploadFileToGcs } from '@/shared/lib/api/product.api';
import { useToastStore } from '@/shared/store/toast';
import { useUpdateProduct } from './queries/product.query';

export const useConfirmUpdateProduct = (product?: Product, onSuccess?: () => void) => {
  const { mutate, isPending } = useUpdateProduct(onSuccess);
  const { addToast } = useToastStore();

  const confirmUpdate = async (updatedProduct: UpdateProduct, imageFile?: File | null) => {
    if (!product) return;

    try {
      if (imageFile) {
        const { signedUrl, publicUrl } = await getProductUploadUrl(imageFile.name, imageFile.type);
        await uploadFileToGcs(signedUrl, imageFile);
        mutate({ id: product.id, ...updatedProduct, imageUrl: publicUrl });
        return;
      }

      mutate({ id: product.id, ...updatedProduct });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload product image';
      addToast(message, 'error');
    }
  };

  return { confirmUpdate, isPending };
};
