import InventoryTable from "@/components/table/InventoryTable"
import useItemStore from "@/store/useItemStore";

const InventoryTableContainer = () => {
    const inventoryItems = useItemStore((state) => state.inventoryItems);
    return(
        <InventoryTable items={inventoryItems}/>
    )
}

export default InventoryTableContainer;