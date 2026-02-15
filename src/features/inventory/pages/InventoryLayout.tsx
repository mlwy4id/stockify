import { Outlet } from 'react-router-dom';
import InventoryPage from './page';

const InventoryLayout = () => {
  return (
    <>
      <InventoryPage />
      <Outlet />
    </>
  );
};

export default InventoryLayout;
