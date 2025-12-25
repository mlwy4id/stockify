import { Button } from "@/components/ui/button";
import PageLayout from "./layout/PageLayout";
import InventoryTableContainer from "@/containers/table/InventoryTableContainer";
import useModalStore from "@/store/useModalStore";

const Inventory = () => {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <PageLayout
      title={"Inventory"}
      button={
        <Button onClick={() => openModal("CREATE_ITEM")}>Add Inventory</Button>
      }
    >
      <InventoryTableContainer />
    </PageLayout>
  );
};

export default Inventory;
