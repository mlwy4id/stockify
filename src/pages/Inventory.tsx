import { Button } from "@/components/ui/button";
import PageLayout from "./PageLayout";
import CreateInventoryForm from "@/containers/form/CreateInventoryForm";
import InventoryTableContainer from "@/containers/table/InventoryTableContainer";

const Inventory = () => {
  return (
    <PageLayout title={"Inventory"} button={<Button>Add Inventory</Button>}>
      <CreateInventoryForm />
      <InventoryTableContainer/>
    </PageLayout>
  );
};

export default Inventory;
