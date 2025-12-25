import InventoryForm from "@/components/form/InventoryForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateItemSchema } from "@/schemas/inventorySchema";
import type { CreateItem } from "@/types/inventory";

const CreateInventoryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateItem>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
        name: "",
        quantity: 0
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
  }

  return <InventoryForm register={register} onSubmitHandler={handleSubmit(onSubmit)} errors={errors} />;
};

export default CreateInventoryForm;
