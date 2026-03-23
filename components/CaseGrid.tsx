'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAutoAnimate } from '@formkit/auto-animate/react'; 
import CaseCard from './CaseCard';
import TechCaseCard from './TechCaseCard';
import AiChatCard from './AiChatCard'; 

export interface Project {
  slug: string;
  title: string;
  tags: string;
  previewImage: string;
  createdAt: string;
  size?: 'standard' | 'wide' | 'narrow';
  computedSize?: string;
  type?: 'visual' | 'tech';
  codeSnippet?: string;
  description?: string;
  canExpand?: boolean; 
}

interface CaseGridProps {
  initialProjects: Project[];
}

function processSmartGrid(projects: Project[], isMobile: boolean) {
  const grid: Project[] = [];
  const pool = projects.map(p => ({ ...p, computedSize: p.size || 'standard' }));

  // --- СУПЕР-НАДЕЖНОЕ ЛЕЧЕНИЕ ДЫР НА МОБИЛКАХ ---
  if (isMobile) {
    const narrowCards = pool.filter(p => p.computedSize === 'narrow');
    
    // Если количество узких карточек нечетное — 100% будет дыра
    if (narrowCards.length % 2 !== 0) {
      let holeFixed = false;

      // Шаг 1: Ищем карточку с твоим флагом canExpand
      for (let i = pool.length - 1; i >= 0; i--) {
        if (pool[i].computedSize === 'narrow' && pool[i].canExpand) {
          pool[i].computedSize = 'standard'; 
          holeFixed = true;
          break; 
        }
      }

      // Шаг 2: ФОЛБЭК. Если canExpand не сработал (например, потерялся в JSON),
      // просто насильно берем самую последнюю узкую карточку в списке и расширяем её.
      if (!holeFixed) {
        for (let i = pool.length - 1; i >= 0; i--) {
          if (pool[i].computedSize === 'narrow') {
            pool[i].computedSize = 'standard';
            break;
          }
        }
      }
    }
  }
  // --- КОНЕЦ МОБИЛЬНОГО БЛОКА ---

  let currentRow: Project[] = [];
  let currentCols = 2; // ИИ-чат занимает 2 колонки
  let patternCycle = 0; 

  const getCols = (p: Project) => {
    if (p.computedSize === 'narrow') return 1;
    if (p.computedSize === 'span-3') return 3;
    if (p.computedSize === 'wide' || p.computedSize === 'span-4') return 4;
    return 2; 
  };

  while (pool.length > 0) {
    const leftInRow = 4 - currentCols;

    let foundIndex = -1;
    for (let i = 0; i < Math.min(pool.length, 4); i++) {
      if (getCols(pool[i]) <= leftInRow) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      const item = pool.splice(foundIndex, 1)[0];
      currentRow.push(item);
      currentCols += getCols(item);
    } else {
      if (leftInRow === 1 && currentRow.length > 0) {
        const prevItem = currentRow[currentRow.length - 1];
        if (getCols(prevItem) === 2) {
          prevItem.computedSize = 'span-3'; 
          currentCols = 4;
        } else {
          currentCols = 4;
        }
      } else {
        currentCols = 4;
      }
    }

    if (currentCols >= 4) {
      if (currentRow.length === 3) {
        const twos = currentRow.filter(p => getCols(p) === 2);
        const ones = currentRow.filter(p => getCols(p) === 1);

        if (twos.length === 1 && ones.length === 2) {
          if (patternCycle === 0) {
            currentRow = [twos[0], ones[0], ones[1]]; 
          } else if (patternCycle === 1) {
            currentRow = [ones[0], ones[1], twos[0]]; 
          } else if (patternCycle === 2) {
            currentRow = [ones[0], twos[0], ones[1]]; 
          }
          patternCycle = (patternCycle + 1) % 3;
        }
      }

      grid.push(...currentRow);
      currentRow = [];
      currentCols = 0;
    }
  }

  if (currentRow.length > 0) {
    grid.push(...currentRow);
  }

  return grid;
}

export default function CaseGrid({ initialProjects }: CaseGridProps) {
  const [parentRef] = useAutoAnimate();

  // --- ЗАЩИТА ОТ ОШИБОК ГИДРАТАЦИИ NEXT.JS ---
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Компонент успешно загружен в браузере
    const checkMobile = () => {
      // matchMedia работает точнее и строго совпадает с CSS @media
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkMobile(); // Проверяем сразу при монтировании
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sortedByDefault = useMemo(() => {
    return [...initialProjects].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [initialProjects]);

  const [projects, setProjects] = useState<Project[]>(sortedByDefault);

  const smartProjects = useMemo(() => {
    // Если мы еще на сервере (не смонтированы), отдаем дефолтную сетку без мобильных хаков
    if (!isMounted) return processSmartGrid(projects, false);
    
    // Когда мы точно в браузере, запускаем алгоритм с учетом ширины экрана
    return processSmartGrid(projects, isMobile);
  }, [projects, isMobile, isMounted]);

  const handleSearchResults = (relevantSlugs: string[]) => {
    const sorted = [...initialProjects].sort((a, b) => {
      const aRel = relevantSlugs.includes(a.slug);
      const bRel = relevantSlugs.includes(b.slug);
      if (aRel !== bRel) return aRel ? -1 : 1; 
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
    setProjects(sorted);
  };

  return (
    <section className="case-grid" ref={parentRef}>
      <AiChatCard 
        initialProjects={initialProjects} 
        onSearchResults={handleSearchResults} 
      />
      {smartProjects.map((p) => {
        const isTechProject = p.size === 'wide' || p.type === 'tech';
        return (
          <Link key={p.slug} href={`/portfolio/${p.slug}`} className={`case-link size-${p.computedSize}`}>
            {isTechProject ? (
              <TechCaseCard 
                title={p.title} 
                tags={p.tags} 
                description={p.description || "Pipeline automation & scripting."} 
                codeSnippet={p.codeSnippet || "# System Ready."} 
              />
            ) : (
              <CaseCard title={p.title} tags={p.tags} imageSrc={p.previewImage} />
            )}
          </Link>
        );
      })}
    </section>
  );
}