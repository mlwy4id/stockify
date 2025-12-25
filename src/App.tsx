import { Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import Modal from './components/Modal';
import CreateInventoryForm from './containers/form/CreateInventoryForm';

function App() {
  return (
    <div>
      <div className="h-screen flex">
        <Sidebar />

        <main className="overflow-y-auto px-5 w-screen min-h-screen">
          <Navbar />

          <Routes>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>

      <Modal>
        <CreateInventoryForm />
      </Modal>
    </div>
  );
}

export default App;
