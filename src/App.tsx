import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Reports from './pages/reports/page';
import Navbar from './components/Navbar';
import InventoryLayout from './pages/inventory/InventoryLayout';
import CreateItemPage from './pages/inventory/Create';
import EditItemPage from './pages/inventory/Edit';
import DeleteItemPage from './pages/inventory/Delete';
import TransactionLayout from './pages/transactions/TransactionLayout';
import CreateTransactionPage from './pages/transactions/Create';
import EditTransactionPage from './pages/transactions/Edit';
import DeleteTransactionPage from './pages/transactions/Delete';
import DashboardPage from './pages/dashboard/page';
import SignUpPage from './pages/sign-up/page';
import SignInPage from './pages/sign-in/page';
import { PrivateRoute } from './components/PrivateRoute';
import { useState } from 'react';
import MobileSidebar from './components/sidebar/MobileSidebar';

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="h-screen flex">
        <Sidebar />
        <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="overflow-y-auto w-screen min-h-screen">
          <Navbar setIsOpen={setIsOpen} />

          <div className="px-6">
            <Routes>
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/sign-in" element={<SignInPage />} />

              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Navigate to={'/dashboard'} />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                <Route path="/transactions" element={<TransactionLayout />}>
                  <Route path="new" element={<CreateTransactionPage />} />
                  <Route path=":id/edit" element={<EditTransactionPage />} />
                  <Route path=":id/delete" element={<DeleteTransactionPage />} />
                </Route>

                <Route path="/inventory" element={<InventoryLayout />}>
                  <Route path="new" element={<CreateItemPage />} />
                  <Route path=":id/edit" element={<EditItemPage />} />
                  <Route path=":id/delete" element={<DeleteItemPage />} />
                </Route>

                <Route path="/reports" element={<Reports />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
