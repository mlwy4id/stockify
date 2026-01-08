import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Reports from './pages/Reports/page';
import Navbar from './components/Navbar';
import InventoryLayout from './pages/Inventory/InventoryLayout';
import CreateItemPage from './pages/Inventory/Create';
import EditItemPage from './pages/Inventory/Edit';
import DeleteItemPage from './pages/Inventory/Delete';
import TransactionLayout from './pages/Transactions/TransactionLayout';
import CreateTransactionPage from './pages/Transactions/Create';
import EditTransactionPage from './pages/Transactions/Edit';

function App() {
  return (
    <div>
      <div className="h-screen flex">
        <Sidebar />

        <main className="overflow-y-auto w-screen min-h-screen">
          <Navbar />

          <div className="px-6">
            <Routes>
              <Route path="/transactions" element={<TransactionLayout />}>
                <Route path="new" element={<CreateTransactionPage />} />
                <Route path=":id/edit" element={<EditTransactionPage />} />
              </Route>

              <Route path="/inventory" element={<InventoryLayout />}>
                <Route path="new" element={<CreateItemPage />} />
                <Route path=":id/edit" element={<EditItemPage />} />
                <Route path=":id/delete" element={<DeleteItemPage />} />
              </Route>

              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
