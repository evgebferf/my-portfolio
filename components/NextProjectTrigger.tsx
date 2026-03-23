'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface NextProjectTriggerProps {
  nextSlug: string;
  nextTitle: string;
}

// Увеличили порог: теперь нужно "тянуть" дольше
const MAX_PULL = 250; 

export default function NextProjectTrigger({ nextSlug, nextTitle }: NextProjectTriggerProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (isNavigatingRef.current) return;

    let accumulatedWheel = 0;
    let wheelTimeout: NodeJS.Timeout;
    let touchStartY = 0;

    const checkNavigation = (val: number) => {
      if (val >= MAX_PULL && !isNavigatingRef.current) {
        isNavigatingRef.current = true;
        setIsNavigating(true);
        setPullDistance(MAX_PULL);
        
        // МАГИЯ ПЛАВНОСТИ: 
        // Ждем 600мс, пока текст красиво улетит вверх, и только потом грузим новую страницу!
        setTimeout(() => {
          router.push(`/portfolio/${nextSlug}`);
        }, 600);
        
      } else {
        setPullDistance(val);
      }
    };

    // 1. ДЕСКТОП: Колесико мыши
    const handleWheel = (e: WheelEvent) => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      
      if (isAtBottom && e.deltaY > 0) {
        // Уменьшили чувствительность мыши в 3 раза (0.15 вместо 0.5)
        accumulatedWheel += e.deltaY * 0.15;
        checkNavigation(accumulatedWheel);

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          // Если юзер отпустил скролл, плавно сбрасываем
          if (!isNavigatingRef.current) {
            accumulatedWheel = 0;
            setPullDistance(0);
          }
        }, 300);
      } else if (e.deltaY < 0 && !isNavigatingRef.current) {
        accumulatedWheel = 0;
        setPullDistance(0);
      }
    };

    // 2. МОБИЛКИ: Свайп
    const handleTouchStart = (e: TouchEvent) => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (isAtBottom) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === 0) return;
      
      const currentY = e.touches[0].clientY;
      // Добавили коэффициент 0.8, чтобы свайп пальцем ощущался чуть "тяжелее"
      const delta = (touchStartY - currentY) * 0.8; 
      
      if (delta > 0) {
        checkNavigation(delta);
      }
    };

    const handleTouchEnd = () => {
      touchStartY = 0;
      if (!isNavigatingRef.current) {
        accumulatedWheel = 0;
        setPullDistance(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      clearTimeout(wheelTimeout);
    };
  }, [nextSlug, router]);

  if (!nextSlug) return null;

  const progress = Math.min((pullDistance / MAX_PULL) * 100, 100);
  const dynamicTransition = pullDistance === 0 ? 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';

  return (
    <div className="next-project-trigger">
      <div 
        className={`trigger-content ${isNavigating ? 'navigating' : ''}`}
        style={{
          transform: `scale(${0.95 + (progress / 100) * 0.05})`,
          opacity: 0.5 + (progress / 100) * 0.5,
          transition: dynamicTransition
        }}
      >
        <span className="trigger-label">
          {progress >= 100 ? 'Releasing...' : 'Keep scrolling for next project'}
        </span>
        <h2 className="trigger-title">{nextTitle}</h2>

        <div className="trigger-progress-bar">
          <div 
            className="trigger-progress-fill" 
            style={{ 
              width: `${progress}%`,
              transition: dynamicTransition 
            }} 
          />
        </div>
      </div>
    </div>
  );
}