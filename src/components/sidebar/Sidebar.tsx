import SidebarOptions from "./SidebarOptions";
import { LuArchive } from "react-icons/lu";
import { LuChartColumn } from "react-icons/lu";

const Sidebar = () => {
  return (
    <nav
      className="
        bg-gray-50 pt-5 flex flex-col gap-2
        h-screen sticky w-[20%] top-0
        shadow-md border border-gray-200
    "
    >
      <h1 className="font-semibold text-2xl mx-2 pb-4 border-b border-b-gray-200 ">Stockify</h1>
      <ul>
        <SidebarOptions icon={LuArchive} name="Inventory" />
        <SidebarOptions icon={LuChartColumn} name="Reports" />
      </ul>
    </nav>
  );
};

export default Sidebar;
