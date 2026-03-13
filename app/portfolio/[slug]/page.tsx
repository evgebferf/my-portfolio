import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

// Добавь async перед функцией
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  // Добавь await перед params
  const { slug } = await params;

  const ProjectComponent = dynamic(
    () => import(`@/components/projects/${slug}/${slug}`).catch(() => notFound()),
    { loading: () => <p>Загрузка проекта...</p> }
  );

  return (
    <main>
       <ProjectComponent />
    </main>
  );
}