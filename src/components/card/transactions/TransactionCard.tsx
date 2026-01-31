import { Button } from "@/components/ui/button";

const TransactionCard = ({ 
    name = "Topi",
    quantity = 10,
    action = "Restock", // "Sold" | "Restock"
    date = "12 Jan 2026",
  }) => {
    const isSold = action === "Sold";
  
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
        
        {/* Left content */}
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-gray-900">
            {name}
          </span>
  
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>
              Qty: {isSold ? "-" : "+"}{quantity}
            </span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
  
        {/* Right content */}
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium
              ${isSold 
                ? "bg-red-100 text-red-600" 
                : "bg-green-100 text-green-600"
              }`}
          >
            {action}
          </span>
  
          <Button className="text-gray-400 hover:text-gray-600">
            ⋮
          </Button>
        </div>
  
      </div>
    );
  };

export default TransactionCard;
