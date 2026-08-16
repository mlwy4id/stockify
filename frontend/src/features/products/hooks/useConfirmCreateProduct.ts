import type { CreateProduct } from '@/shared/types/product.type';
import { getProductUploadUrl, uploadFileToGcs } from '@/shared/lib/api/product.api';
import { useToastStore } from '@/shared/store/toast';
import { useCreateProduct } from './queries/product.query';

export const useConfirmCreateProduct = (onSuccess?: () => void) => {
  const { mutate, isPending } = useCreateProduct(onSuccess);
  const { addToast } = useToastStore();

  const confirmCreate = async (product: CreateProduct, imageFile?: File | null) => {
    try {
      if (imageFile) {
        const { signedUrl, publicUrl } = await getProductUploadUrl(imageFile.name, imageFile.type);
        await uploadFileToGcs(signedUrl, imageFile);
        mutate({ ...product, imageUrl: publicUrl });
        return;
      }

      mutate(product);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload product image';
      addToast(message, 'error');
    }
  };

  return { confirmCreate, isPending };
};
