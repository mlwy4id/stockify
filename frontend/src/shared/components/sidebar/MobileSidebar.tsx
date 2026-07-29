'use client';
import SidebarOptions from './SidebarOptions';
import UserProfileCard from './UserProfileCard';
import { Archive, House, NotebookText, X, ChartColumn, Inbox } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import clsx from 'clsx';

const MobileSidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            className={clsx(
              'fixed z-50',
              'bg-sidebar',
              'md:hidden flex flex-col',
              'h-screen w-[50%] sm:w-[30%] top-0 left-0',
              'gap-2',
              'shadow-md border border-sidebar-border'
            )}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { ease: 'easeInOut' } }}
            exit={{ x: -300, opacity: 0, transition: { ease: 'easeOut' } }}
          >
            <nav>
              <div className="flex items-center justify-end px-4 py-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <ul className="mt-4 px-1">
                <SidebarOptions icon={House} name="Dashboard" />
                <SidebarOptions icon={NotebookText} name="Transactions" />
                <SidebarOptions
                  icon={Archive}
                  name="Products"
                  childrenOptions={[
                    { icon: Inbox, name: 'Add Category', to: '/products?category=new' },
                  ]}
                />
                <SidebarOptions icon={ChartColumn} name="Reports" />
              </ul>
            </nav>

            <div className="mt-auto">
              <UserProfileCard />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
