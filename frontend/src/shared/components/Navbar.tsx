'use client';
import { CircleUser, Menu, Boxes } from 'lucide-react';

const Navbar = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
    <header className="sticky top-0 z-10 p-4 md:hidden bg-background/50 backdrop-blur-md border-b border-border">
      <nav className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Menu size={24} onClick={() => setIsOpen(true)} className="cursor-pointer" />
          <div className="flex gap-1 items-center">
            <Boxes className="text-primary" size={22} />
            <h1 className="font-bold text-xl">Stockify</h1>
          </div>
        </div>
        <CircleUser size={24} />
      </nav>
    </header>
  );
};

export default Navbar;
