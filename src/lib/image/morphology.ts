/* Contenido del Lab 8 (пп. 14–19). Los parámetros no se usan todavía. */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { clone } from './access';
import type { BorderMode, GrayImage } from './types';

/**
 * Operadores morfológicos básicos sobre imágenes binarias.
 *
 * Con A el conjunto de píxeles de objeto y B el elemento estructurante:
 *
 *     Dilatación   A ⊕ B = { z | (B̂)_z ∩ A ≠ ∅ }   → máximo de la vecindad
 *     Erosión      A ⊖ B = { z | (B)_z ⊆ A }        → mínimo de la vecindad
 *
 * Sobre niveles de gris de 8 bits, con el objeto en blanco (255) y el fondo en
 * negro (0), se reducen a estadísticos de orden en la ventana definida por B:
 *
 *     dilate(x, y) = máx { f(x + s, y + t) : B(s, t) = 1 }
 *     erode (x, y) = mín { f(x + s, y + t) : B(s, t) = 1 }
 *
 * A partir de ellos salen el resto de operaciones del Lab 8: apertura
 * (erosión seguida de dilatación), cierre (al revés), extracción de bordes
 * (A − (A ⊖ B) o (A ⊕ B) − A) y el esqueleto por adelgazamiento iterativo.
 *
 * Los píxeles fuera de la imagen se leen con `at(src, x, y, mode)`: para la
 * erosión suele interesar `clamp`, y para la dilatación `zero`, de modo que el
 * borde de la imagen no genere objeto de la nada.
 */

/** Forma del elemento estructurante ofrecida en la interfaz del Lab 8. */
export type SEShape = 'square' | 'cross';

/** Elemento estructurante: máscara 0/1 centrada en `(radiusX, radiusY)`. */
export interface StructuringElement {
  width: number;
  height: number;
  /** Máscara en orden fila-mayor: 1 = el píxel participa, 0 = se ignora. */
  mask: Uint8Array;
}

/**
 * Construye el elemento estructurante de tamaño `size`×`size` (impar).
 *
 * - `square`: todos los píxeles de la ventana valen 1.
 * - `cross`:  solo la fila y la columna centrales valen 1.
 */
export function createStructuringElement(
  size: number,
  shape: SEShape,
): StructuringElement {
  // TODO(lab-8): rellenar la máscara según la forma pedida.
  return { width: size, height: size, mask: new Uint8Array(size * size) };
}

/** Dilatación: máximo de la vecindad marcada por el elemento estructurante. */
export function dilate(
  src: GrayImage,
  se: StructuringElement,
  mode: BorderMode = 'zero',
): GrayImage {
  // TODO(lab-8): implementar el máximo sobre la ventana de `se`.
  return clone(src);
}

/** Erosión: mínimo de la vecindad marcada por el elemento estructurante. */
export function erode(
  src: GrayImage,
  se: StructuringElement,
  mode: BorderMode = 'clamp',
): GrayImage {
  // TODO(lab-8): implementar el mínimo sobre la ventana de `se`.
  return clone(src);
}
