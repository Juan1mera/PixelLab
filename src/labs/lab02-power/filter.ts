import { clamp8, clone, createGray, maxLevel } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import { num, type OperationResult, type ParamValues } from '@/labs/types';

/**
 * Степенное преобразование / corrección gamma (п. 3).
 *
 * Forma general del enunciado:
 *
 *     s = c · r^γ,        c > 0, γ > 0
 *
 * El enunciado exige además que la salida quede escalada al rango de la
 * entrada [0, L − 1]. Para que el nivel más alto (L − 1) se transforme en sí
 * mismo, c no es libre sino que vale
 *
 *     c = (L − 1) / (L − 1)^γ = (L − 1)^(1 − γ)
 *
 * y la transformación queda
 *
 *     s = (L − 1) · ( r / (L − 1) )^γ
 *
 * Igual que en el Lab 1, L − 1 es el brillo máximo que aparece en la imagen
 * (`maxLevel`); en una imagen de 8 bits con algún píxel blanco vale 255.
 *
 *   γ < 1  el rango estrecho de sombras se expande (la imagen se aclara);
 *   γ = 1  identidad;
 *   γ > 1  el rango amplio de luces se expande (la imagen se oscurece).
 *
 * Pasos:
 *   1. Leer γ con `num(params, 'gamma')` y hallar L − 1 con una pasada.
 *   2. Precalcular la tabla de 256 entradas t[r] = (L − 1)·(r/(L − 1))^γ:
 *      `Math.pow` se llama 256 veces y no una vez por píxel.
 *   3. Recorrer la imagen escribiendo `t[src.data[i]]`.
 */
export function power(src: GrayImage, params: ParamValues): OperationResult {
  const gamma = Math.max(num(params, 'gamma', 1), 0.01);
  const top = maxLevel(src); // L − 1

  // Imagen completamente negra: no hay rango que escalar.
  if (top === 0) {
    return {
      image: clone(src),
      message: {
        ru: 'Изображение чёрное (L − 1 = 0): преобразование не требуется.',
        es: 'Imagen negra (L − 1 = 0): no hay nada que transformar.',
      },
    };
  }

  const c = Math.pow(top, 1 - gamma);

  const table = new Uint8ClampedArray(256);
  for (let r = 0; r <= top; r++) {
    table[r] = clamp8(c * Math.pow(r, gamma));
  }

  const out = createGray(src.width, src.height);
  for (let i = 0; i < src.data.length; i++) {
    out.data[i] = table[src.data[i]];
  }

  const text = `γ = ${gamma.toFixed(2)} · c = ${formatC(c)} · L − 1 = ${top}`;
  return { image: out, message: { ru: text, es: text } };
}

/** c puede ir de ~1e-10 a ~250: notación exponencial solo cuando hace falta. */
function formatC(c: number): string {
  return c >= 0.01 && c < 1000 ? c.toFixed(4) : c.toExponential(3);
}
