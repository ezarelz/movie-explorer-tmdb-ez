import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './styles/globals.css';
import Toaster from '@/components/ui/Toaster';

const nunito = Nunito({
  variable: '--font-geist-nunito',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Movie Explorer Library - WPH by Ezar',
  description: 'Better Movie Library Listing',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={`${nunito.variable} bg-[#0B0B11] text-white antialiased`}
    >
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
