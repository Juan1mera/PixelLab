/* Contenido del Lab 6 (пп. 10–11). Los parámetros no se usan todavía. */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GrayImage } from './types';

/**
 * Histograma de brillos y su acumulado.
 *
 * Histograma:      h(k) = número de píxeles con nivel k,  k = 0..255
 * Normalizado:     p(k) = h(k) / (width · height),        Σ p(k) = 1
 * Acumulado:       c(k) = Σ_{j=0..k} h(j),                c(255) = width · height
 *
 * La ecualización usa el acumulado como función de transformación:
 *
 *     s(k) = round( (L - 1) · c(k) / (width · height) )
 *
 * es decir, reparte los niveles de forma que el histograma resultante se
 * aproxime al uniforme. La variante que evita el desplazamiento del negro
 * resta el primer valor no nulo del acumulado:
 *
 *     s(k) = round( (L - 1) · (c(k) - c_min) / (width · height - c_min) )
 */

/** 256 contadores, uno por nivel de gris. */
export type Histogram = Uint32Array;

export const LEVELS = 256;

/** Devuelve un histograma vacío (todos los contadores a cero). */
export function emptyHistogram(): Histogram {
  return new Uint32Array(LEVELS);
}

/**
 * Cuenta cuántos píxeles hay de cada nivel.
 *
 * Pasos: reservar 256 contadores, recorrer `img.data` una vez e incrementar
 * `h[valor]`. Un solo bucle plano, sin objetos dentro.
 */
export function computeHistogram(img: GrayImage): Histogram {
  // TODO(lab-6): contar los niveles de gris de la imagen.
  return emptyHistogram();
}

/**
 * Histograma acumulado: `c[k] = c[k-1] + h[k]`.
 *
 * Un único recorrido de 256 posiciones arrastrando la suma parcial.
 */
export function cumulativeHistogram(h: Histogram): Uint32Array {
  // TODO(lab-6): acumular los contadores.
  return new Uint32Array(LEVELS);
}
