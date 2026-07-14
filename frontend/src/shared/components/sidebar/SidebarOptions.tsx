'use client';

import { cn } from '@/shared/lib/utils';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ChildOption = {
  name: string;
  to: string;
};

type Props = {
  icon: LucideIcon;
  name: string;
  childrenOptions?: ChildOption[];
};

const SidebarOptions = ({ icon: Icon, name, childrenOptions }: Props) => {
  const pathname = usePathname();
  const basePath = `/${name.toLowerCase()}`;
  const childActive = childrenOptions?.some((child) => pathname.startsWith(child.to));
  const isActive = !childActive && pathname.startsWith(basePath);

  return (
    <>
      <Link
        href={basePath}
        className={cn(
          `group flex gap-2 items-center mb-0.5 mx-2 p-2 rounded-md hover:cursor-pointer`,
          isActive ? 'bg-blue-100 font-medium' : 'font-normal hover:bg-gray-200'
        )}
      >
        <Icon className={isActive ? 'text-blue-500' : 'text-black'} size={20} />
        <p className={cn(`lg:text-lg`, isActive ? 'text-blue-700 font-semibold' : 'text-black')}>
          {name}
        </p>
      </Link>
      {childrenOptions && childrenOptions.length > 0 && (
        <ul className="ml-9 mr-2 mb-0.5">
          {childrenOptions.map((child) => {
            const isChildActive = pathname.startsWith(child.to);
            return (
              <li key={child.to}>
                <Link
                  href={child.to}
                  className={cn(
                    `block p-2 rounded hover:bg-gray-100 text-sm text-gray-700`,
                    isChildActive ? 'bg-blue-100 font-medium' : 'font-normal hover:bg-gray-200'
                  )}
                >
                  <p className={cn(`lg:text-[16px]`, isChildActive ? 'text-blue-700 font-semibold' : 'text-black')}>
                    {child.name}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default SidebarOptions;
