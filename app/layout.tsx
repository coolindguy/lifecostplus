import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GlobalLayout from '@/components/GlobalLayout';
import { I18nProvider } from '@/lib/i18n/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeCost+ | Where Can You Live Well For What You Earn?',
  description: 'Compare U.S. cities based on affordability and quality of life',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <GlobalLayout>{children}</GlobalLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
