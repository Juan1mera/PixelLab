/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { ParamValues } from '@/labs/types';

/**
 * Corte de un rango de brillos, «intensity level slicing» (п. 4).
 *
 * Con el intervalo de interés [a, b] = [`min`, `max`] hay dos variantes:
 *
 *   modo `binary`   (resalta y aplana el resto)
 *       g = 255            si a ≤ f ≤ b
 *       g = 0              en otro caso
 *
 *   modo `preserve` (resalta pero conserva el fondo)
 *       g = 255            si a ≤ f ≤ b
 *       g = f              en otro caso
 *
 * Pasos:
 *   1. Leer `min`, `max` con `num` y `mode` con `str`.
 *   2. Ordenar el intervalo si el usuario cruzó los deslizadores (a > b).
 *   3. Recorrer la imagen aplicando la condición; un solo `if` por píxel.
 */
export function slice(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-3): implementar el corte de rango en sus dos modos.
  return clone(src);
}
