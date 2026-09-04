/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { ParamValues } from '@/labs/types';

/**
 * Detección de contornos por derivadas (пп. 7–9).
 *
 * Módulo del gradiente, aproximado por la suma de valores absolutos:
 *
 *     |∇f| = √(Gx² + Gy²) ≈ |Gx| + |Gy|
 *
 * Roberts (cruzado, 2×2):
 *     Gx = [ 1  0 ]      Gy = [  0  1 ]
 *          [ 0 −1 ]           [ −1  0 ]
 *
 * Sobel (3×3, promedia en la dirección perpendicular):
 *     Gx = [ −1  0  1 ]  Gy = [ −1 −2 −1 ]
 *          [ −2  0  2 ]       [  0  0  0 ]
 *          [ −1  0  1 ]       [  1  2  1 ]
 *
 * Laplaciano (segunda derivada, isótropo, un solo núcleo):
 *     ∇²f = [  0 −1  0 ]      (variante de 8 vecinos: −1 en las diagonales
 *           [ −1  4 −1 ]       y 8 en el centro)
 *           [  0 −1  0 ]
 *
 * El parámetro `normalize` decide la salida:
 *   - activado: se escala el máximo real de la respuesta a 255, así se ve todo
 *     el rango de contornos aunque el gradiente sea débil;
 *   - desactivado: se satura con `clamp8` sin reescalar.
 *
 * Pasos:
 *   1. Obtener las respuestas crudas con `convolveRaw` (Float32Array con signo).
 *   2. Combinar: |Gx| + |Gy| para Roberts y Sobel; |∇²f| para el laplaciano.
 *   3. Buscar el máximo si `normalize`, y escribir con `clamp8`.
 */
export function roberts(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-5): implementar el operador de Roberts.
  return clone(src);
}

export function sobel(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-5): implementar el operador de Sobel.
  return clone(src);
}

export function laplacian(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-5): implementar el laplaciano.
  return clone(src);
}
