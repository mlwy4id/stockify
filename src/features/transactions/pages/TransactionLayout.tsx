import { Outlet } from 'react-router-dom';
import TransactionsPage from './page';

const TransactionLayout = () => {
  return (
    <>
      <TransactionsPage />
      <Outlet />
    </>
  );
};

export default TransactionLayout;
