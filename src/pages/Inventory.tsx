import { Button } from "@/components/ui/button";
import PageLayout from "./layout/PageLayout";
import InventoryTableContainer from "@/containers/table/InventoryTableContainer";
import { useModalActions } from "@/hooks/useModalActions";

const Inventory = () => {
  const { openCreateItem } = useModalActions();

  return (
    <PageLayout
      title={"Inventory"}
      button={<Button onClick={openCreateItem}>Add Inventory</Button>}
    >
      <InventoryTableContainer />
    </PageLayout>
  );
};

export default Inventory;
