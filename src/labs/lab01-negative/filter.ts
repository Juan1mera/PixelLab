import { createGray, maxLevel } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { OperationResult } from '@/labs/types';

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
export function negative(src: GrayImage): OperationResult {
  const level = maxLevel(src);
  const out = createGray(src.width, src.height);

  for (let i = 0; i < src.data.length; i++) {
    out.data[i] = level - src.data[i];
  }

  return {
    image: out,
    message: {
      ru: `L = ${level}`,
      es: `L = ${level}`,
    },
  };
}
