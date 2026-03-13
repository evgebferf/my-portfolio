import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import '../styles/global.css'; // Custom styles
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata: Metadata = {
  title: 'Motion Designer Portfolio',
  description: 'Professional portfolio website for a motion designer',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
  {/* Запрет на перевод, виджеты и авто-определение языка для Яндекса */}
  <meta name="yandex-tableau-widget" content="disable" />
  <meta name="ya-title" content="none" />
  <meta name="translate" content="no" />
  <meta name="google-site-verification" content="Depdgdedh20UtJEzt-Lb3goDPWXurKns_EVVLEgq38A" />
</head>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}