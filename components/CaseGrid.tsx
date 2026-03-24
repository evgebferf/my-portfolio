'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAutoAnimate } from '@formkit/auto-animate/react'; 
import CaseCard from './CaseCard';
import TechCaseCard from './TechCaseCard';
import AiChatCard from './AiChatCard'; 
// ИМПОРТИРУЕМ НАШУ ЕДИНУЮ ЖЕЛЕЗНУЮ СОРТИРОВКУ
import { getStableSortedProjects } from '@/utils/sortProjects';

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
  // Делаем глубокую копию, чтобы не мутировать исходники
  const pool = JSON.parse(JSON.stringify(projects)).map((p: Project) => ({
    ...p,
    computedSize: p.size || 'standard'
  }));
  
  const grid: Project[] = [];

  if (isMobile) {
    const narrowCards = pool.filter((p: Project) => p.computedSize === 'narrow');
    if (narrowCards.length % 2 !== 0) {
      let holeFixed = false;
      for (let i = pool.length - 1; i >= 0; i--) {
        if (pool[i].computedSize === 'narrow' && pool[i].canExpand) {
          pool[i].computedSize = 'standard'; 
          holeFixed = true;
          break; 
        }
      }
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

  let currentRow: Project[] = [];
  let currentCols = 2; // AI Chat (2 колонки)
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

    // Ищем первый проект в очереди, который влезает в остаток строки
    for (let i = 0; i < Math.min(pool.length, 10); i++) {
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
      // Если ничего не влезает, расширяем предыдущую карточку
      if (leftInRow === 1 && currentRow.length > 0) {
        const prevItem = currentRow[currentRow.length - 1];
        if (getCols(prevItem) === 2) {
          prevItem.computedSize = 'span-3'; 
        }
      }
      currentCols = 4;
    }

    if (currentCols >= 4) {
      // Магия паттернов (1+1+2 или 2+1+1)
      if (currentRow.length === 3) {
        const twos = currentRow.filter(p => getCols(p) === 2);
        const ones = currentRow.filter(p => getCols(p) === 1);
        if (twos.length === 1 && ones.length === 2) {
          if (patternCycle === 1) currentRow = [ones[0], ones[1], twos[0]];
          else if (patternCycle === 2) currentRow = [ones[0], twos[0], ones[1]];
          patternCycle = (patternCycle + 1) % 3;
        }
      }
      grid.push(...currentRow);
      currentRow = [];
      currentCols = 0;
    }
  }

  if (currentRow.length > 0) grid.push(...currentRow);
  return grid;
}

export default function CaseGrid({ initialProjects }: CaseGridProps) {
  const [parentRef] = useAutoAnimate();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Состояние для поиска
  const [relevantSlugs, setRelevantSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. ГЛАВНЫЙ ИСТОЧНИК ПРАВДЫ (СОРТИРОВКА)
  const displayProjects = useMemo(() => {
    // Сначала ВСЕГДА сортируем всё по дате
    const dateSortedAll = getStableSortedProjects(initialProjects);

    if (!relevantSlugs) return dateSortedAll;

    // Если есть поиск: релевантные наверх, остальные вниз (внутри каждой группы сохраняем дату)
    const relevant = dateSortedAll.filter(p => relevantSlugs.includes(p.slug));
    const others = dateSortedAll.filter(p => !relevantSlugs.includes(p.slug));

    return [...relevant, ...others];
  }, [initialProjects, relevantSlugs]);

  // 3. ФОРМИРОВАНИЕ СЕТКИ
  const smartProjects = useMemo(() => {
    // Пока не смонтировались, рендерим дефолт без мобильных хаков
    return processSmartGrid(displayProjects, isMounted ? isMobile : false);
  }, [displayProjects, isMobile, isMounted]);

  const handleSearchResults = (slugs: string[]) => {
    setRelevantSlugs(slugs.length > 0 ? slugs : null);
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
          <Link 
            key={p.slug} 
            href={`/portfolio/${p.slug}`} 
            className={`case-link size-${p.computedSize}`}
          >
            {isTechProject ? (
              <TechCaseCard 
                title={p.title} 
                tags={p.tags} 
                description={p.description || ""} 
                codeSnippet={p.codeSnippet || ""} 
              />
            ) : (
              <CaseCard 
                title={p.title} 
                tags={p.tags} 
                imageSrc={p.previewImage} 
              />
            )}
          </Link>
        );
      })}
    </section>
  );
}