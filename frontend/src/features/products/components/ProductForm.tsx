'use client';
import { useMemo } from 'react';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Category } from '@/shared/types/category.type';

type Props = {
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  onSubmitHandler: () => void;
  cancelHandler: () => void;
  submitBtn: React.ReactNode;
  categoryList: Category[];
  imageFile?: File | null;
  onImageChange?: (file: File | null) => void;
  imageUrl?: string | null;
  showQuantity?: boolean;
};

const ProductForm = ({
  register,
  control,
  errors,
  onSubmitHandler,
  cancelHandler,
  submitBtn,
  categoryList,
  imageFile,
  onImageChange,
  imageUrl,
  showQuantity = true,
}: Props) => {
  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : imageUrl ?? null),
    [imageFile, imageUrl]
  );

  return (
    <form
      className="w-full h-full flex flex-col gap-4 font-jakarta-sans"
      onSubmit={onSubmitHandler}
    >
      <div className="grid gap-2">
        <label htmlFor="productName">
          Nama Produk <span className="text-danger">*</span>
        </label>
        <Input id="productName" type="text" {...register('name')} />
        {errors.name && <p className="text-danger">{String(errors.name.message)}</p>}
      </div>

      {onImageChange && (
        <div className="grid gap-2">
          <label htmlFor="productImage">Gambar Produk</label>
          <Input
            id="productImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onImageChange(file);
            }}
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Pratinjau produk"
              className="mt-1 h-32 w-32 object-cover rounded-md border"
            />
          ) : (
            <p className="text-xs text-muted-foreground">Tidak ada gambar dipilih</p>
          )}
        </div>
      )}

      {showQuantity && (
        <div className="grid gap-2">
          <label htmlFor="productQuantity">
          Jumlah <span className="text-danger">*</span>
        </label>
          <Input
            id="productQuantity"
            type="number"
            min={0}
            {...register('quantity', { valueAsNumber: true })}
          />
          {errors.quantity && <p className="text-danger">{String(errors.quantity.message)}</p>}
        </div>
      )}

      <div className="grid gap-2">
        <label htmlFor="productThreshold">
          Ambang Stok <span className="text-danger">*</span>
        </label>
        <Input
          id="productThreshold"
          type="number"
          min={0}
          {...register('stockThreshold', { valueAsNumber: true })}
        />
        {errors.stockThreshold && (
          <p className="text-danger">{String(errors.stockThreshold.message)}</p>
        )}
      </div>

      <div className="grid gap-2">
        <label>Kategori</label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              key={field.value ?? ''}
              value={field.value ?? ''}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  {categoryList.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline" onClick={cancelHandler} type="button">
          Batal
        </Button>
        {submitBtn}
      </div>
    </form>
  );
};

export default ProductForm;
