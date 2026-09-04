/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { ParamValues } from '@/labs/types';

/**
 * Negativo de la imagen (п. 2).
 *
 *     g(x, y) = L − f(x, y)
 *
 * donde L es el brillo máximo que aparece realmente en la imagen, no 255:
 * `maxLevel(src)` de `@/lib/image/access`. Con esa definición el píxel más
 * claro pasa a 0 y el más oscuro a L, y una imagen de bajo contraste no se
 * desplaza al invertirla.
 *
 * Pasos:
 *   1. Calcular L recorriendo la imagen una vez.
 *   2. Reservar la salida con `createGray(src.width, src.height)`.
 *   3. Escribir `L − src.data[i]` en cada posición.
 */
export function negative(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-1): implementar la inversión g = L − f.
  return clone(src);
}
