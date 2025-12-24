import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Item {
  name: string;
  quantity: number;
}

type Props = {
  item: Item;
  onChangeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
};

const InventoryForm = ({ item, onChangeHandler }: Props) => {
  return (
    <form className="w-full h-full flex flex-col gap-4">
      <div className="grid gap-2">
        <label htmlFor="itemName">Item Name:</label>
        <Input
          id="itemName"
          type="text"
          value={item.name}
          name="name"
          onChange={(e) => onChangeHandler(e)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="itemQuantity">Quantity:</label>
        <Input
          id="itemQuantity"
          type="number"
          value={item.quantity}
          name="quantity"
          min={0}
          onChange={(e) => onChangeHandler(e)}
        />
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-blue-600">Add Item</Button>
      </div>
    </form>
  );
};

export default InventoryForm;
