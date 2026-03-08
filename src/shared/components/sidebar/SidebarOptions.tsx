import { cn } from '@/shared/lib';
import type { IconType } from 'react-icons/lib';
import { NavLink, useLocation, matchPath } from 'react-router-dom';

type ChildOption = {
  name: string;
  to: string;
};

type Props = {
  icon: IconType;
  name: string;
  childrenOptions?: ChildOption[];
};

const SidebarOptions = ({ icon: Icon, name, childrenOptions }: Props) => {
  const { pathname } = useLocation();
  const childActive =
    childrenOptions && childrenOptions.some((child) => matchPath(child.to + '/*', pathname));
  const isActive = !childActive && matchPath(`/${name.toLowerCase()}/*`, pathname);

  return (
    <>
      <NavLink
        to={`/${name.toLowerCase()}`}
        className={cn(
          `group flex gap-2 items-center mb-0.5 mx-2 p-2 rounded-md hover:cursor-pointer`,
          `${isActive ? 'bg-blue-100 font-medium' : 'font-normal hover:bg-gray-200'}`
        )}
      >
        <Icon className={`${isActive ? 'text-blue-500' : 'text-black'}`} size={20} />
        <p
          className={cn(
            `heading lg:text-xl`,
            `${isActive ? 'text-blue-700 font-semibold' : 'text-black'}`
          )}
        >
          {name}
        </p>
      </NavLink>
      {childrenOptions && childrenOptions.length > 0 && (
        <ul className="ml-9 mr-2 mb-0.5">
          {childrenOptions.map((child) => {
            const isChildActive = matchPath(child.to + '/*', pathname);

            return (
              <li key={child.to}>
                <NavLink
                  to={child.to}
                  className={cn(
                    `block p-2 rounded hover:bg-gray-100 text-sm text-gray-700`,
                    `${isChildActive ? 'bg-blue-100 font-medium' : 'font-normal hover:bg-gray-200'}`
                  )}
                >
                  <p
                    className={cn(
                      `heading lg:text-[16px]`,
                      `${isChildActive ? 'text-blue-700 font-semibold' : 'text-black'}`
                    )}
                  >
                    {child.name}
                  </p>
                </NavLink>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default SidebarOptions;
