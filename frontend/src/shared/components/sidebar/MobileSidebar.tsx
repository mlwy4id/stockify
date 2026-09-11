'use client';
import SidebarOptions from './SidebarOptions';
import UserProfileCard from './UserProfileCard';
import { Archive, House, NotebookText, X, Tags } from 'lucide-react';
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
              'h-screen w-[60%] sm:w-[40%] top-0 left-0',
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
                  className="p-1 rounded-md hover:bg-accent cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <ul className="mt-4 px-1">
                <SidebarOptions icon={House} name="Beranda" to="/dashboard" setSidebarClose={setIsOpen} />
                <SidebarOptions
                  icon={NotebookText}
                  name="Transaksi"
                  to="/transactions"
                  setSidebarClose={setIsOpen}
                />
                <SidebarOptions icon={Archive} name="Produk" to="/products" setSidebarClose={setIsOpen} />
                <SidebarOptions icon={Tags} name="Kategori" to="/categories" setSidebarClose={setIsOpen} />
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
