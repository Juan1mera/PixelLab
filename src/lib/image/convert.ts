import { createGray } from './access';
import type { GrayImage } from './types';

/**
 * Conversión RGBA (lo que da y come `<canvas>`) ↔ gris de 8 bits.
 *
 * Luma de la recomendación BT.601:
 *
 *     Y = 0.299·R + 0.587·G + 0.114·B
 *
 * Son los pesos clásicos de la televisión analógica: ponderan cada canal según
 * la sensibilidad del ojo, por eso el verde pesa más que el rojo y el rojo más
 * que el azul. El canal alfa se descarta al entrar y se fija a 255 al salir.
 */

export const LUMA_R = 0.299;
export const LUMA_G = 0.587;
export const LUMA_B = 0.114;

/** RGBA → gris. No modifica el `ImageData` de entrada. */
export function imageDataToGray(image: ImageData): GrayImage {
  const { width, height, data } = image;
  const out = createGray(width, height);
  const dst = out.data;

  for (let i = 0, p = 0; p < dst.length; i += 4, p++) {
    dst[p] = LUMA_R * data[i] + LUMA_G * data[i + 1] + LUMA_B * data[i + 2];
  }

  return out;
}

/** Gris → RGBA opaco, listo para `ctx.putImageData()`. */
export function grayToImageData(img: GrayImage): ImageData {
  const out = new ImageData(img.width, img.height);
  const dst = out.data;
  const src = img.data;

  for (let p = 0, i = 0; p < src.length; p++, i += 4) {
    const v = src[p];
    dst[i] = v;
    dst[i + 1] = v;
    dst[i + 2] = v;
    dst[i + 3] = 255;
  }

  return out;
}
