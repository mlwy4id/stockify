import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";
import ModalContainer from "./containers/modal/ModalContainer";
import useModalStore from "./store/useModalStore";
import InventoryLayout from "./pages/Inventory/InventoryLayout";

function App() {
  const isModalOpen = useModalStore((state) => state.isOpen);

  return (
    <div>
      <div className="h-screen flex">
        <Sidebar />

        <main className="overflow-y-auto w-screen min-h-screen">
          <Navbar />

          <div className="px-6">
            <Routes>
              <Route path="/inventory" element={<InventoryLayout />}>
                <Route path=":id" element={<InventoryRoute />} />
              </Route>
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </main>
      </div>

      {isModalOpen && <ModalContainer />}
    </div>
  );
}

export default App;
