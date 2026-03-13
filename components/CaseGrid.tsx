import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import CaseCard from './CaseCard';

export default function CaseGrid() {
  const projectsDir = path.join(process.cwd(), 'components/projects');
  
  const entries = fs.readdirSync(projectsDir, { withFileTypes: true });

  const projects = entries
    .filter((entry) => entry.isDirectory())
    .map((folder) => {
      const folderPath = path.join(projectsDir, folder.name);
      const metaPath = path.join(folderPath, 'metadata.json');
      
      if (!fs.existsSync(metaPath)) return null;

      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      
      // Получаем статистику папки (включая дату создания)
      const stats = fs.statSync(folderPath);
      
      return { 
        slug: folder.name, 
        ...meta,
        createdAt: stats.birthtimeMs // Время создания в миллисекундах
      };
    })
    .filter(Boolean)
    // Сортировка: b.createdAt - a.createdAt (от новых к старым)
    .sort((a: any, b: any) => b.createdAt - a.createdAt);

  return (
    <section className="case-grid">
      {projects.map((p: any) => (
        <Link key={p.slug} href={`/portfolio/${p.slug}`}>
          <CaseCard
            title={p.title}
            tags={p.tags}
            imageSrc={p.previewImage}
          />
        </Link>
      ))}
    </section>
  );
}