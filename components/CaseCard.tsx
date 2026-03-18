'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
// @ts-ignore
import ColorThief from 'colorthief';

interface CaseCardProps {
  title: string;
  tags: string;
  imageSrc: string;
}

export default function CaseCard({ title, tags, imageSrc }: CaseCardProps) {
  // Состояние: rgb цвет фона и цвет текста
  const [dominantColor, setDominantColor] = useState('0, 0, 0');
  const [isDark, setIsDark] = useState(true); // true = текст белый, false = текст черный
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    if (imgRef.current) {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(imgRef.current);
      if (color) {
        const [r, g, b] = color;
        setDominantColor(`${r}, ${g}, ${b}`);
        
        // Формула яркости: если яркость > 150, фон светлый, текст должен быть черным
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setIsDark(brightness < 150);
      }
    }
  };

  return (
    <article className="case-card">
      <div className="case-image-wrapper">
        <Image
          ref={imgRef}
          src={imageSrc}
          alt={title}
          fill
          onLoad={handleLoad}
          crossOrigin="anonymous"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="case-image"
          unoptimized 
        />
        
        <div 
          className="case-info"
          style={{
            // Градиент всегда подстраивается под основной цвет картинки
            background: `linear-gradient(to top, rgba(${dominantColor}, 0.85) 0%, transparent 100%)`
          }}
        >
          <h2 className="case-title" style={{ color: isDark ? '#fff' : '#000' }}>
            {title}
          </h2>
          <p className="case-tags" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
            {tags}
          </p>
        </div>
      </div>
    </article>
  );
}