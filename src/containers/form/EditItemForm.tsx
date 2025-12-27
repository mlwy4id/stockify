import InventoryForm from "@/components/form/InventoryForm";
import { useFindItem } from "@/hooks/useFindItem";
import { useModalActions } from "@/hooks/useModalActions";
import { UpdateItemSchema } from "@/schemas/inventorySchema";
import useItemStore from "@/store/useItemStore";
import useModalStore from "@/store/useModalStore";
import type { UpdateItem } from "@/types/inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const EditItemForm = () => {
  const payload = useModalStore((state) => state.payload);
  const updateItem = useItemStore((state) => state.updateItem);
  const { closeModalAndBackToPreviousPage } = useModalActions();

  const item = useFindItem(payload?.itemId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateItem>({
    resolver: zodResolver(UpdateItemSchema),
    defaultValues: {
      name: item?.name,
      quantity: Number(item?.quantity),
    },
  });

  const onSubmit = (data: any) => {
    updateItem(payload?.itemId, data);
    closeModalAndBackToPreviousPage();
  };

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(onSubmit)}
      errors={errors}
      cancelHandler={closeModalAndBackToPreviousPage}
    />
  );
};

export default EditItemForm;
