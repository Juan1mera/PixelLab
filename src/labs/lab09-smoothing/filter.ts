/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { ParamValues } from '@/labs/types';

/**
 * Filtros de suavizado, lineal y no lineal (пп. 5–6).
 *
 * Media aritmética (filtro lineal, convolución con máscara constante):
 *
 *     g(x, y) = (1 / n²) · Σ_{s=-a..a} Σ_{t=-a..a} f(x + s, y + t),   a = (n−1)/2
 *
 * Mediana (filtro de orden, no lineal):
 *
 *     g(x, y) = mediana { f(x + s, y + t) : |s| ≤ a, |t| ≤ a }
 *
 * La media difumina los bordes junto con el ruido; la mediana elimina el ruido
 * impulsivo («sal y pimienta») conservando mucho mejor los bordes, porque un
 * valor extremo aislado nunca queda en el centro de la lista ordenada.
 *
 * Pasos de `mean`:
 *   1. Leer `size` con `num` y construir la máscara con `kernel()`.
 *   2. Delegar en `convolve(src, k, mode)` de `@/lib/image/convolve`.
 *
 * Pasos de `median`:
 *   1. Reservar la salida y un buffer de n² valores fuera de los bucles.
 *   2. Para cada píxel, volcar la vecindad con `at(src, x, y, mode)`.
 *   3. Ordenar el buffer y tomar la posición central.
 */
export function mean(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-4): implementar la media aritmética n×n.
  return clone(src);
}

export function median(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-4): implementar la mediana n×n.
  return clone(src);
}
