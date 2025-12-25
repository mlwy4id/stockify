import InventoryForm from "@/components/form/InventoryForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateItemSchema } from "@/schemas/inventorySchema";
import type { CreateItem } from "@/types/inventory";
import useItemStore from "@/store/useItemStore";

const CreateInventoryForm = () => {
  const addItem = useItemStore((state) => state.addItem);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItem>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      name: "",
      quantity: 0,
    },
  });

  const onSubmit = (data: any) => {
    const dataWithId = { ...data, id: crypto.randomUUID() };
    addItem(dataWithId);
    console.log(dataWithId);
  };

  return (
    <InventoryForm
      register={register}
      onSubmitHandler={handleSubmit(onSubmit)}
      errors={errors}
    />
  );
};

export default CreateInventoryForm;
