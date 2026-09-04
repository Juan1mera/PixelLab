/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { ParamValues } from '@/labs/types';

/**
 * Histograma y ecualización (пп. 10–11).
 *
 * El histograma h(k) cuenta los píxeles de nivel k; su implementación vive en
 * `@/lib/image/histogram` (`computeHistogram`, `cumulativeHistogram`), que es
 * lo que dibuja el panel de la derecha.
 *
 * Ecualización: se usa el histograma acumulado como función de transformación,
 *
 *     s(k) = round( 255 · (c(k) − c_min) / (N − c_min) ),   N = width · height
 *
 * donde c(k) es el acumulado y c_min su primer valor no nulo. La resta de c_min
 * evita que el nivel más oscuro se desplace del negro. El histograma resultante
 * no queda perfectamente plano —los niveles son discretos y no se pueden
 * partir—, pero sí lo más uniforme posible.
 *
 * Pasos de `equalize`:
 *   1. `computeHistogram(src)` y `cumulativeHistogram(h)`.
 *   2. Localizar c_min y construir la tabla s[k] de 256 entradas.
 *   3. Recorrer la imagen escribiendo `s[src.data[i]]`.
 */

/**
 * «Показать гистограмму»: la imagen no se toca, el trabajo lo hace el panel
 * del histograma. Es la identidad a propósito, no un stub pendiente.
 */
export function view(src: GrayImage, params: ParamValues): GrayImage {
  return clone(src);
}

export function equalize(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-6): implementar la ecualización con el histograma acumulado.
  return clone(src);
}
