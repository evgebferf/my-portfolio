// utils/sortProjects.ts
import { Project } from '@/components/CaseGrid';
export const getStableSortedProjects = (projects: Project[]) => {
  return [...projects].sort((a, b) => {
    // 1. Сравниваем даты как строки (YYYY-MM-DD отлично сортируется по алфавиту)
    const dateA = a.createdAt || "";
    const dateB = b.createdAt || "";

    if (dateA !== dateB) {
      // Сортировка по убыванию (самые свежие сверху)
      return dateB.localeCompare(dateA);
    }

    // 2. Если даты совпали (или их нет) — железная сортировка по slug
    const slugA = a.slug || "";
    const slugB = b.slug || "";
    return slugA.localeCompare(slugB);
  });
};