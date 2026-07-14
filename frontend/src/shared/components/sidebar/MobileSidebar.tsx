'use client';
import SidebarOptions from './SidebarOptions';
import { Archive, House, NotebookText, X, ChartColumn } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

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
        <motion.aside
          className="fixed z-20 bg-sidebar pt-5 md:hidden flex flex-col gap-2 h-screen w-[50%] sm:w-[30%] top-0 shadow-md border border-sidebar-border"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 100, transition: { ease: 'easeInOut' } }}
          exit={{ x: -300, opacity: 0, transition: { ease: 'easeOut' } }}
        >
          <nav>
            <div className="w-full flex justify-end px-4 pb-2">
              <X size={20} onClick={() => setIsOpen(false)} className="cursor-pointer" />
            </div>
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
