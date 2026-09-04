/**
 * Tipos base del pipeline de imagen.
 *
 * Todo PixeLab trabaja en escala de grises de 8 bits: un único plano de
 * `width * height` muestras en [0, 255]. Los filtros de los laboratorios
 * reciben y devuelven `GrayImage`; la conversión desde/hacia RGBA vive en
 * `convert.ts` y solo se usa en los bordes (carga de fichero y pintado).
 */

/** Imagen en escala de grises, 1 byte por píxel, orden fila-mayor. */
export interface GrayImage {
  width: number;
  height: number;
  /** Longitud exacta `width * height`. Índice del píxel (x, y): `y * width + x`. */
  data: Uint8ClampedArray;
}

/**
 * Qué hacer cuando una ventana de vecindad se sale de la imagen.
 *
 * - `clamp`   repite el píxel del borde         (… a a | a b c d | d d …)
 * - `reflect` refleja sin duplicar el borde     (… c b | a b c d | c b …)
 * - `zero`    rellena con 0 (negro)             (… 0 0 | a b c d | 0 0 …)
 */
export type BorderMode = 'clamp' | 'reflect' | 'zero';
