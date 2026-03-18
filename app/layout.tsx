import type {Metadata} from 'next';
import { Inter } from 'next/font/google';

// --- ВОТ ЗДЕСЬ ПОДКЛЮЧАЮТСЯ ВСЕ ТВОИ СТИЛИ ---
import '@/styles/global.css'; 
import '@/styles/layout.css';    
import '@/styles/showreel.css';   
import '@/styles/case-grid.css';  
import '@/styles/chat.css';       
import '@/styles/tech-card-light.css'; // <--- ... НА ЭТО!

// ---------------------------------------------

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata: Metadata = { 
  title: 'Evgeniy Prilepskiy Portfolio',
  description: 'Portfolio of Evgeniy Prilepskiy (Евгений Прилепский). Professional motion design, 3D animation, and visual effects.',
  keywords: ['Evgeniy Prilepskiy', 'Евгений Прилепский', 'Motion Design', 'Portfolio'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Evgeniy Prilepskiy",
              "alternateName": "Евгений Прилепский",
              "jobTitle": "Motion Designer",
              "url": "https://my-portfolio-two-liard-75.vercel.app"
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}