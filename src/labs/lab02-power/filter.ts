/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { ParamValues } from '@/labs/types';

/**
 * Transformación de potencia o corrección gamma (п. 3).
 *
 *     s = c · r^γ,    con r = f(x, y) / 255 ∈ [0, 1]
 *     g(x, y) = clamp8( 255 · c · r^γ )
 *
 * Parámetros: `c` (ganancia, 0.1–3) y `gamma` (exponente, 0.1–5).
 * Con γ < 1 la curva es cóncava y aclara las sombras; con γ > 1 es convexa y
 * oscurece; con γ = 1 y c = 1 la transformación es la identidad.
 *
 * Pasos:
 *   1. Leer `c` y `gamma` con `num(params, …)`.
 *   2. Precalcular la tabla de 256 entradas t[k] = clamp8(255·c·(k/255)^γ).
 *      Así `Math.pow` se llama 256 veces y no una vez por píxel.
 *   3. Recorrer la imagen escribiendo `t[src.data[i]]`.
 */
export function power(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-2): implementar s = c · r^γ con tabla de consulta.
  return clone(src);
}
