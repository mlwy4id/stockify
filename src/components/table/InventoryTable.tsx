import type { Item } from "@/types/inventory";

type Props = {
  items: Item[];
};

const InventoryTable = ({ items }: Props) => {
  return (
    <table className="w-full text-left">
      <thead className="border-b border-black">
        <tr>
          <th>Item Name</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryTable;
