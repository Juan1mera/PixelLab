import type { BorderMode, GrayImage } from './types';

/**
 * Acceso y creación de imágenes en gris.
 *
 * Regla del proyecto: ningún filtro indexa `data[y * width + x]` a pelo dentro
 * de una ventana de vecindad. Se usa `at()`, que aplica la política de bordes.
 */

/** Redondea y satura un valor real al rango entero [0, 255]. */
export function clamp8(value: number): number {
  if (value <= 0) return 0;
  if (value >= 255) return 255;
  return Math.round(value);
}

/** Reserva una imagen nueva a negro. */
export function createGray(width: number, height: number): GrayImage {
  return { width, height, data: new Uint8ClampedArray(width * height) };
}

/** Copia independiente: modificar la copia nunca toca el original. */
export function clone(img: GrayImage): GrayImage {
  return {
    width: img.width,
    height: img.height,
    data: new Uint8ClampedArray(img.data),
  };
}

/**
 * Valor del píxel (x, y) con tratamiento de bordes.
 *
 * Fuera de la imagen devuelve lo que dicte `mode` en vez de `undefined`, de
 * modo que un bucle de convolución no necesita casos especiales en los bordes.
 */
export function at(
  img: GrayImage,
  x: number,
  y: number,
  mode: BorderMode = 'clamp',
): number {
  const { width: w, height: h } = img;
  let cx = x;
  let cy = y;

  if (cx < 0 || cx >= w || cy < 0 || cy >= h) {
    switch (mode) {
      case 'zero':
        return 0;
      case 'clamp':
        cx = cx < 0 ? 0 : cx >= w ? w - 1 : cx;
        cy = cy < 0 ? 0 : cy >= h ? h - 1 : cy;
        break;
      case 'reflect':
        cx = reflectIndex(cx, w);
        cy = reflectIndex(cy, h);
        break;
    }
  }

  return img.data[cy * w + cx];
}

/** Reflexión tipo `gfedcb|abcdefgh|gfedcba` (no duplica el píxel del borde). */
function reflectIndex(i: number, size: number): number {
  if (size === 1) return 0;
  let v = i;
  const period = 2 * size - 2;
  v = ((v % period) + period) % period;
  return v < size ? v : period - v;
}

/**
 * `true` si la imagen usa como mucho dos niveles distintos de gris.
 *
 * El Lab 8 (morfología) asume entrada binaria: la interfaz avisa —sin
 * bloquear— cuando esto devuelve `false`.
 */
export function isBinary(img: GrayImage): boolean {
  const seen = new Uint8Array(256);
  let levels = 0;
  for (let i = 0; i < img.data.length; i++) {
    const v = img.data[i];
    if (seen[v] === 0) {
      seen[v] = 1;
      levels++;
      if (levels > 2) return false;
    }
  }
  return true;
}

/** Brillo máximo presente en la imagen. La `L` del Lab 1 se define así. */
export function maxLevel(img: GrayImage): number {
  let max = 0;
  for (let i = 0; i < img.data.length; i++) {
    if (img.data[i] > max) max = img.data[i];
  }
  return max;
}
