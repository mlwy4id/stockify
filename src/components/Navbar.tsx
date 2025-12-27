import { LuCircleUser, LuBell, LuSearch } from "react-icons/lu";
import { Input } from "./ui/input";

const Navbar = () => {
  return (
    <header className="p-4 sticky top-0 bg-white/50 backdrop-blur-md">
      <nav>
        <ul className="flex justify-between items-center">
          <div className="w-[20%] relative">
            <Input className="w-full h-full py-1" placeholder="Search..." />
            <LuSearch className="absolute top-[23%] right-[5%]" />
          </div>
          <div className="flex gap-4 items-center">
            <LuBell size={24} />
            <LuCircleUser size={24} />
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
