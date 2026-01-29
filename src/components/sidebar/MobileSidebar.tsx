import SidebarOptions from './SidebarOptions';
import { LuArchive, LuHouse, LuNotebookText, LuX } from 'react-icons/lu';
import { LuChartColumn } from 'react-icons/lu';
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
          className={`
            fixed z-20
            bg-blue-50 pt-5 md:hidden flex-col gap-2
            h-screen md:sticky w-[50%] sm:w-[30%] md:w-[20%] top-0
            shadow-md border border-gray-200   
        `}
        initial= {{x: -300, opacity: 0}}
        animate={{
            x: 0,
            opacity: 100,
            transition: {
                ease: "easeInOut"
            }
        }}
        exit={{
            x: -300,
            opacity: 0,
            transition: {
                ease: 'easeOut'
            }
        }}
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
