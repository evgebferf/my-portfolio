
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // Скроллим вниз - скрываем
        setShow(false);
      } else {
        // Скроллим вверх - показываем
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
   <nav className={`navbar ${show ? 'nav-visible' : 'nav-hidden'}`}>
  {/* Ссылка на главную по клику на логотип */}
  <Link href="/" className="nav-logo">Evgeniy Prilepskiy</Link>
  
  <div className="nav-links">
    {/* Переход на главную (если там секция портфолио) или на отдельную страницу портфолио */}
    <Link href="/">Portfolio</Link>
    
    {/* Переход на страницу about (убедись, что есть папка app/about) */}
    <Link href="/about">About</Link>
  </div>
</nav>
  );
}