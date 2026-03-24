import fs from 'fs';
import path from 'path';
import ShowreelHero from '@/components/ShowreelHero';
import CaseGrid from '@/components/CaseGrid';
// 1. ИМПОРТИРУЕМ НАШУ ЖЕЛЕЗНУЮ СОРТИРОВКУ
import { getStableSortedProjects } from '@/utils/sortProjects'; 

export default async function PortfolioPage() {
  const projectsDir = path.join(process.cwd(), 'components/projects');
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });

  const unsortedProjects = entries
    .filter((entry) => entry.isDirectory())
    .map((folder) => {
      const folderPath = path.join(projectsDir, folder.name);
      const metaPath = path.join(folderPath, 'metadata.json');
      
      if (!fs.existsSync(metaPath)) return null;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      
      // 🚨 УБРАЛИ fs.statSync!
      // Берем данные строго из metadata.json
      return { 
        slug: folder.name, 
        ...meta // Здесь уже лежит нормальный строковый createdAt (например, "2025-07-15")
      };
    })
    .filter(Boolean);

  // 2. СОРТИРУЕМ ПРАВИЛЬНО (так же, как на клиенте)
  const projects = getStableSortedProjects(unsortedProjects as any[]);

  return (
    <main>
      <ShowreelHero />
      <CaseGrid initialProjects={projects} />
    </main>
  );
}