import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import NextProjectTrigger from '@/components/NextProjectTrigger';

// --- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ЧТЕНИЯ ВСЕХ ПРОЕКТОВ ---
// Она сканирует папки, читает metadata.json и возвращает готовый массив
function getAllProjects() {
  // Указываем путь к папке с проектами
  const projectsDirectory = path.join(process.cwd(), 'components', 'projects');
  
  // Читаем названия всех папок внутри (Artez-Covers, Dental-illustrations и т.д.)
  const folderNames = fs.readdirSync(projectsDirectory);

  // Собираем данные
  const projects = folderNames.map((folderName) => {
    const metadataPath = path.join(projectsDirectory, folderName, 'metadata.json');
    
    // Если в папке есть metadata.json, читаем его
    if (fs.existsSync(metadataPath)) {
      const fileContents = fs.readFileSync(metadataPath, 'utf8');
      return JSON.parse(fileContents);
    }
    return null;
  }).filter(Boolean); // Убираем пустые значения, если папка была без метадаты

  // Сортируем проекты по дате (свежие сверху) — точно так же, как на главной!
  return projects.sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let ProjectComponent;

  // 1. Пытаемся импортировать компонент самого проекта
  try {
    const module = await import(`@/components/projects/${slug}/${slug}`);
    ProjectComponent = module.default;
  } catch (error) {
    notFound(); // Если нет файла — кидаем 404
  }

  // 2. Получаем отсортированный список всех проектов
  const allProjects = getAllProjects();

  // 3. Ищем, на каком месте в списке мы сейчас находимся
  const currentIndex = allProjects.findIndex((p: any) => p.slug === slug);
  let nextProject = null;

  if (currentIndex !== -1) {
    if (currentIndex < allProjects.length - 1) {
      // Берем следующий проект по списку
      nextProject = allProjects[currentIndex + 1];
    } else {
      // Если мы дошли до самого последнего проекта — зацикливаем и кидаем на первый!
      nextProject = allProjects[0];
    }
  }

  return (
    <main>
      {/* Сам проект */}
      <ProjectComponent />
      
      {/* Клиентский триггер для перехода (появляется только если есть следующий проект) */}
      {nextProject && (
        <NextProjectTrigger 
          nextSlug={nextProject.slug} 
          nextTitle={nextProject.title} 
        />
      )}
    </main>
  );
}