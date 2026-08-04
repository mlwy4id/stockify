'use client';
import { useGetUser } from '@/features/auth/hooks/queries/auth.query';
import { useSignOutUser } from '@/features/auth/hooks/queries/auth.query';
import { LogOut } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/button';

const UserProfileCard = () => {
  const { data } = useGetUser();
  const { mutate: signOut, isPending } = useSignOutUser();

  const user = data?.user;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';
  const displayName = user?.name ?? 'Unknown';
  const displayEmail = user?.email ?? '';

  return (
    <div className={clsx('mx-3 mb-4 p-3 rounded-xl', 'border border-sidebar-border', 'bg-sidebar')}>
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            'w-9 h-9 rounded-full',
            'bg-primary text-primary-foreground',
            'flex items-center justify-center',
            'font-bold text-sm shrink-0'
          )}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className={clsx('text-sm font-semibold truncate', 'text-foreground')}>{displayName}</p>
          <p className={clsx('text-xs truncate', 'text-muted-foreground')}>{displayEmail}</p>
        </div>
        <Button
          onClick={() => signOut()}
          disabled={isPending}
          className={clsx(
            'p-1.5 rounded-md',
            'hover:text-danger',
            'transition-colors duration-150',
            'cursor-pointer'
          )}
          title="Sign out"
          variant="ghost"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserProfileCard;
