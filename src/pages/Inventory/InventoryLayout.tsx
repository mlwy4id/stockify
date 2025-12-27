import { Outlet } from "react-router-dom";
import InventoryPage from "./InventoryPage";

const InventoryLayout = () => {
  return (
    <>
      <InventoryPage />
      <Outlet />
    </>
  );
};

export default InventoryLayout;
