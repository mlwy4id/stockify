import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="h-screen flex">
      <Sidebar />

      <div className="overflow-y-auto px-5 w-screen min-h-screen">
        <Navbar/>
        
        <Routes>
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
