import { notFound } from 'next/navigation';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let ProjectComponent;

  try {
    // В серверных компонентах лучше использовать обычный динамический импорт вместо next/dynamic
    const module = await import(`@/components/projects/${slug}/${slug}`);
    ProjectComponent = module.default;
  } catch (error) {
    // Если папки/файла нет - кидаем 404
    notFound();
  }

  return (
    <main>
      <ProjectComponent />
    </main>
  );
}