import { LuCircleUser, LuMenu } from 'react-icons/lu';

const Navbar = () => {
  return (
    <header className="p-4 sticky top-0 bg-white/50 backdrop-blur-md">
      <nav>
        <ul className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <LuMenu size={24} className='md:hidden' />
            <h1 className="font-bold text-xl heading md:hidden">
              Stockify
            </h1>
          </div>
          <div className="flex items-center">
            <LuCircleUser size={24} />
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
