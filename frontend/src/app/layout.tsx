import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './index.css';
import { Providers } from './providers';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Stockify',
  description: 'Inventory management system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
