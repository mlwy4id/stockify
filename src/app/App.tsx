import { useState } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from '@/shared/components';
import { Navbar } from '@/shared/components';

import { InventoryLayout } from '@/features/inventory';
import { CreateItemPage } from '@/features/inventory';
import { EditItemPage } from '@/features/inventory';
import { DeleteItemPage } from '@/features/inventory';

import { TransactionLayout } from '@/features/transactions';
import { CreateTransactionPage } from '@/features/transactions';
import { EditTransactionPage } from '@/features/transactions';
import { DeleteTransactionPage } from '@/features/transactions';

import { ReportsPage } from '@/features/reports';

import { DashboardPage } from '@/features/dashboard';

import { CreateUnitPage } from '@/features/unit';

import { SignUpPage } from '@/features/users';
import { SignInPage } from '@/features/users';

import { PrivateRoute } from '@/shared/components';
import { MobileSidebar } from '@/shared/components';

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
                  <Route path="unit/add" element={<CreateUnitPage />} />
                </Route>

                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
