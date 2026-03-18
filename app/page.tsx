import fs from 'fs';
import path from 'path';
import ShowreelHero from '@/components/ShowreelHero';
import CaseGrid from '@/components/CaseGrid';

export default async function PortfolioPage() {
  // 1. Читаем проекты СРАЗУ ЗДЕСЬ (на сервере)
  const projectsDir = path.join(process.cwd(), 'components/projects');
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });

  const projects = entries
    .filter((entry) => entry.isDirectory())
    .map((folder) => {
      const folderPath = path.join(projectsDir, folder.name);
      const metaPath = path.join(folderPath, 'metadata.json');
      
      if (!fs.existsSync(metaPath)) return null;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      const stats = fs.statSync(folderPath);
      
      return { 
        slug: folder.name, 
        ...meta,
        createdAt: stats.birthtimeMs 
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.createdAt - a.createdAt);

  // 2. Рендерим всё вместе
  return (
    <main>
      <ShowreelHero />
      {/* Передаем проекты в CaseGrid как пропс */}
      <CaseGrid initialProjects={projects} />
    </main>
  );
}