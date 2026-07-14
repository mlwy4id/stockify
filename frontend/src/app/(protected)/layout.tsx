'use client';

import { useGetUser } from '@/features/auth/hooks/queries/auth.query';
import Sidebar from '@/shared/components/sidebar/Sidebar';
import Navbar from '@/shared/components/Navbar';
import MobileSidebar from '@/shared/components/sidebar/MobileSidebar';
import { Spinner } from '@/shared/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, data, isError } = useGetUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!data || isError)) {
      router.replace('/sign-in');
    }
  }, [isLoading, data, isError, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner className="w-96" />
      </div>
    );
  }

  if (!data || isError) return null;

  return (
    <div className="h-screen flex">
      <Sidebar />
      <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="overflow-y-auto w-screen min-h-screen">
        <Navbar setIsOpen={setIsOpen} />
        <div className="px-6">{children}</div>
      </main>
    </div>
  );
}
