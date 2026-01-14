import type { IconType } from 'react-icons/lib';
import { NavLink, useLocation, matchPath } from 'react-router-dom';

type Props = {
  icon: IconType;
  name: string;
};

const SidebarOptions = ({ icon: Icon, name }: Props) => {
  const { pathname } = useLocation();
  const isActive = matchPath(`/${name.toLowerCase()}/*`, pathname);

  return (
    <NavLink
      to={`/${name.toLowerCase()}`}
      className={`
        group flex gap-2 items-center mx-2 mb-1 p-2 rounded-md
        hover:cursor-pointer hover:bg-gray-100
        ${isActive ? 'bg-blue-100 font-medium' : 'font-normal'}
      `}
    >
      <Icon className={`${isActive ? 'text-blue-500' : 'text-black'}`} />
      <p
        className={`
        ${isActive ? 'text-blue-700 font-semibold' : 'text-black'} heading
      `}
      >
        {name}
      </p>
    </NavLink>
  );
};

export default SidebarOptions;
