import SidebarOptions from './SidebarOptions';
import { LuArchive, LuHouse, LuNotebookText } from 'react-icons/lu';
import { LuChartColumn } from 'react-icons/lu';

const Sidebar = () => {
  return (
    <aside
      className={`
        bg-blue-50 pt-5 hidden md:flex flex-col gap-2
        h-screen sticky w-[30%] top-0
        shadow-md border border-gray-200   
      `}
    >
      <nav>
        <h1 className="font-bold text-2xl mx-2 pb-4 border-b border-b-gray-200 heading hidden md:block">
          Stockify
        </h1>
        <ul className="mt-2 heading">
          <SidebarOptions icon={LuHouse} name="Dashboard" />
          <SidebarOptions icon={LuNotebookText} name="Transactions" />
          <SidebarOptions icon={LuArchive} name="Inventory" />
          <SidebarOptions icon={LuChartColumn} name="Reports" />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
