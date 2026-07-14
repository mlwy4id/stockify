'use client';
import SidebarOptions from './SidebarOptions';
import { Archive, House, NotebookText, ChartColumn } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="bg-sidebar pt-5 hidden md:flex flex-col gap-2 h-screen sticky w-64 top-0 shadow-md border border-sidebar-border shrink-0">
      <nav>
        <h1 className="font-bold text-2xl mx-2 pb-4 border-b border-b-sidebar-border hidden md:block">
          Stockify
        </h1>
        <ul className="mt-2">
          <SidebarOptions icon={House} name="Dashboard" />
          <SidebarOptions icon={NotebookText} name="Transactions" />
          <SidebarOptions
            icon={Archive}
            name="Inventory"
            childrenOptions={[{ name: 'Add Unit', to: '/inventory/unit/add' }]}
          />
          <SidebarOptions icon={ChartColumn} name="Reports" />
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
