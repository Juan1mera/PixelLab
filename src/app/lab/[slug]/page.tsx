import { notFound } from 'next/navigation';
import LabWorkspace from '@/components/LabWorkspace';
import { getLabBySlug, labSlugs } from '@/labs/registry';

/** Prerrenderiza las ocho rutas en `next build`. */
export function generateStaticParams() {
  return labSlugs.map((slug) => ({ slug }));
}

export default async function LabPage({ params }: PageProps<'/lab/[slug]'>) {
  const { slug } = await params;
  if (!getLabBySlug(slug)) notFound();

  // Solo viaja el slug: `LabDefinition` contiene funciones (`apply`) y no es
  // serializable a través de la frontera servidor → cliente.
  return <LabWorkspace slug={slug} />;
}
