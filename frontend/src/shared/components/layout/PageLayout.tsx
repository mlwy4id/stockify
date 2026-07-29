'use client';
import { Plus } from 'lucide-react';

type Props = {
  title: string;
  navLink?: string;
  onAddClick?: () => void;
  children: React.ReactNode;
};

const PageLayout = ({ title, navLink, onAddClick, children }: Props) => {
  const AddButton = navLink ? (
    <a
      href={navLink}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
      aria-label="Tambah"
    >
      <Plus className="w-6 h-6" />
    </a>
  ) : onAddClick ? (
    <button
      onClick={onAddClick}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors cursor-pointer"
      aria-label="Tambah"
    >
      <Plus className="w-6 h-6" />
    </button>
  ) : null;

  return (
    <div className="w-full h-screen pt-4 md:pt-10 flex flex-col gap-2 relative">
      <div className="flex justify-between items-center min-h-12 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
      </div>
      <div className="pb-8 flex flex-col gap-4">{children}</div>
      {AddButton}
    </div>
  );
};

export default PageLayout;
