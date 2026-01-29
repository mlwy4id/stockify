import SidebarOptions from './SidebarOptions';
import { LuArchive, LuHouse, LuNotebookText, LuX } from 'react-icons/lu';
import { LuChartColumn } from 'react-icons/lu';

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <aside
      className={`
        bg-blue-50 pt-5 md:flex flex-col gap-2
        h-screen md:sticky w-[50%] sm:w-[30%] md:w-[20%] top-0
        shadow-md border border-gray-200 
        ${isOpen ? `fixed z-20` : `hidden`}   
      `}
    >
      <nav>
        <div className="w-full md:hidden flex justify-end px-4 pb-2">
          <LuX size={20} onClick={() => setIsOpen(false)} />
        </div>
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
