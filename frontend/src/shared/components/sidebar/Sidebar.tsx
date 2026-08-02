'use client';
import SidebarOptions from './SidebarOptions';
import UserProfileCard from './UserProfileCard';
import { Archive, House, NotebookText, Inbox, Boxes } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
  return (
    <aside
      className={clsx(
        'bg-sidebar',
        'hidden md:flex flex-col',
        'h-screen sticky top-0 w-64 shrink-0',
        'gap-2',
        'shadow-md border border-sidebar-border'
      )}
    >
      <nav>
        <div
          className={clsx(
            'px-4 py-6',
            'border-b border-b-sidebar-border',
            'hidden md:flex items-center gap-2'
          )}
        >
          <Boxes className="text-blue-500" size={24} />
          <h1 className="font-bold text-2xl">Stockify</h1>
        </div>

        <ul className="mt-4 px-1">
          <SidebarOptions icon={House} name="Dashboard" />
          <SidebarOptions icon={NotebookText} name="Transactions" />
          <SidebarOptions
            icon={Archive}
            name="Products"
            childrenOptions={[{ icon: Inbox, name: 'Add Category', to: '/products?category=new' }]}
          />
        </ul>
      </nav>

      <div className="mt-auto">
        <UserProfileCard />
      </div>
    </aside>
  );
};

export default Sidebar;
