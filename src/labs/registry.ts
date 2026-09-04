import { lab01 } from './lab01-negative/meta';
import { lab02 } from './lab02-power/meta';
import { lab03 } from './lab03-slice/meta';
import { lab04 } from './lab04-smoothing/meta';
import { lab05 } from './lab05-gradients/meta';
import { lab06 } from './lab06-histogram/meta';
import { lab07 } from './lab07-threshold/meta';
import { lab08 } from './lab08-morphology/meta';
import type { LabDefinition } from './types';

/** Los ocho laboratorios, en el orden del temario. */
export const labs: readonly LabDefinition[] = [
  lab01,
  lab02,
  lab03,
  lab04,
  lab05,
  lab06,
  lab07,
  lab08,
];

/** Slugs válidos para `generateStaticParams()`. */
export const labSlugs: readonly string[] = labs.map((lab) => lab.slug);

/**
 * Busca un laboratorio por su slug de URL.
 *
 * Devuelve funciones (`apply`), así que el `LabDefinition` no puede cruzar la
 * frontera servidor → cliente: pasa el `slug` y resuélvelo ya en el cliente.
 */
export function getLabBySlug(slug: string): LabDefinition | undefined {
  return labs.find((lab) => lab.slug === slug);
}
