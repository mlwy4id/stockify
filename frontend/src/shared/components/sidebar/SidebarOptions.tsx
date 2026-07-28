'use client';

import { useState } from 'react';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { AnimatePresence, motion } from 'motion/react';

type ChildOption = {
  icon: LucideIcon;
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
  const hasChildren = childrenOptions && childrenOptions.length > 0;
  const childActive = childrenOptions?.some((child) => pathname.startsWith(child.to));
  const isActive = !childActive && pathname.startsWith(basePath);

  const [expanded, setExpanded] = useState(childActive ?? false);

  return (
    <>
      <div className="flex items-center">
        <Link
          href={basePath}
          className={clsx(
            'group flex-1 flex gap-5 items-center',
            'mb-1 mx-2 p-2 rounded-md hover:cursor-pointer',
            isActive ? 'bg-blue-100 font-medium' : 'font-normal hover:bg-gray-200'
          )}
        >
          <Icon className={isActive ? 'text-blue-500' : 'text-black'} size={22} />

          <p
            className={clsx(
              'lg:text-md',
              isActive ? 'text-blue-700 font-bold' : 'text-black font-semibold'
            )}
          >
            {name}
          </p>

          {hasChildren && (
            <Button
              onClick={() => setExpanded(!expanded)}
              className={clsx(
                '-ml-4 md:ml-10 rounded-md hover:bg-gray-200 transition-transform duration-200',
                expanded && 'rotate-90',
                'cursor-pointer'
              )}
              variant="ghost"
            >
              <ChevronRight size={16} />
            </Button>
          )}
        </Link>
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
            className="overflow-hidden ml-13 mr-2 mb-0.5"
          >
            {childrenOptions.map((child) => {
              const isChildActive = pathname.startsWith(child.to);
              return (
                <li key={child.to}>
                  <Link
                    href={child.to}
                    className={clsx(
                      'flex items-center gap-3',
                      'block p-2 rounded text-sm text-gray-700',
                      isChildActive ? 'bg-blue-200 font-medium' : 'font-normal hover:bg-gray-300'
                    )}
                  >
                    <child.icon
                      className={isChildActive ? 'text-blue-500' : 'text-black'}
                      size={18}
                    />
                    <p
                      className={clsx(
                        'lg:text-[16px]',
                        isChildActive ? 'text-blue-700 font-bold' : 'text-black font-semibold'
                      )}
                    >
                      {child.name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarOptions;
