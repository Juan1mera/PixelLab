/* Implementado en el Lab 4 (laplaciano); lo reutiliza el suavizado por media. */
import { at, clamp8, createGray } from './access';
import type { BorderMode, GrayImage } from './types';

/**
 * Convolución espacial con máscara arbitraria.
 *
 * Para una máscara w de tamaño m×n con m = 2a+1 y n = 2b+1:
 *
 *     g(x, y) = (1 / D) · Σ_{s=-a..a} Σ_{t=-b..b} w(s, t) · f(x + s, y + t) + O
 *
 * donde D es el divisor (`kernel.divisor`, por defecto la suma de los
 * coeficientes, o 1 si esa suma es cero) y O el desplazamiento
 * (`kernel.offset`, por defecto 0). Los píxeles f(x+s, y+t) que caen fuera de
 * la imagen se leen con `at(src, x, y, mode)`.
 *
 * Pasos del algoritmo:
 *   1. Reservar la salida con `createGray(src.width, src.height)`.
 *   2. Calcular el divisor efectivo una sola vez, fuera de los bucles.
 *   3. Para cada píxel (x, y), acumular la suma ponderada de su vecindad.
 *   4. Escribir `clamp8(suma / D + O)` en la salida.
 *
 * Se implementa la **correlación** (la máscara no se refleja), que es como el
 * enunciado aplica las máscaras: el coeficiente w(s, t) multiplica a
 * f(x + s, y + t). Para máscaras simétricas (media, laplaciano) coincide con
 * la convolución estricta.
 */
export interface Kernel {
  width: number;
  height: number;
  /** Coeficientes en orden fila-mayor, longitud `width * height`. */
  data: readonly number[];
  /** Divisor D. Si se omite, la suma de los coeficientes (o 1 si es 0). */
  divisor?: number;
  /** Desplazamiento O añadido tras dividir. Por defecto 0. */
  offset?: number;
}

/** Construye una máscara a partir de sus coeficientes. Valida el tamaño. */
export function kernel(
  width: number,
  height: number,
  data: readonly number[],
  options: { divisor?: number; offset?: number } = {},
): Kernel {
  if (data.length !== width * height) {
    throw new Error(
      `La máscara ${width}×${height} necesita ${width * height} coeficientes, recibí ${data.length}.`,
    );
  }
  if (width % 2 === 0 || height % 2 === 0) {
    throw new Error(`La máscara ${width}×${height} debe tener lados impares.`);
  }
  return { width, height, data, ...options };
}

/** Coeficiente central w(0, 0) de la máscara. */
export function centerWeight(k: Kernel): number {
  return k.data[((k.height - 1) / 2) * k.width + (k.width - 1) / 2];
}

/** Divisor efectivo D: el explícito, o la suma de coeficientes (1 si es 0). */
function effectiveDivisor(k: Kernel): number {
  if (k.divisor !== undefined && k.divisor !== 0) return k.divisor;
  let sum = 0;
  for (let i = 0; i < k.data.length; i++) sum += k.data[i];
  return sum === 0 ? 1 : sum;
}

/**
 * Respuesta cruda de la máscara, sin dividir ni saturar:
 *
 *     R(x, y) = Σ_{s=-a..a} Σ_{t=-b..b} w(s, t) · f(x + s, y + t)
 *
 * Devuelve `width * height` valores reales con signo. Es lo que necesita el
 * laplaciano del Lab 4, cuya respuesta es negativa a un lado de cada contorno.
 */
export function convolveRaw(
  src: GrayImage,
  k: Kernel,
  mode: BorderMode = 'clamp',
): Float32Array {
  const { width: w, height: h } = src;
  const out = new Float32Array(w * h);
  const a = (k.width - 1) / 2;
  const b = (k.height - 1) / 2;
  const coef = k.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let i = 0;
      for (let t = -b; t <= b; t++) {
        for (let s = -a; s <= a; s++, i++) {
          const wst = coef[i];
          if (wst !== 0) sum += wst * at(src, x + s, y + t, mode);
        }
      }
      out[y * w + x] = sum;
    }
  }

  return out;
}

/** Convolución completa: respuesta cruda, divisor, desplazamiento y `clamp8`. */
export function convolve(
  src: GrayImage,
  k: Kernel,
  mode: BorderMode = 'clamp',
): GrayImage {
  const raw = convolveRaw(src, k, mode);
  const d = effectiveDivisor(k);
  const o = k.offset ?? 0;
  const out = createGray(src.width, src.height);
  for (let i = 0; i < raw.length; i++) {
    out.data[i] = clamp8(raw[i] / d + o);
  }
  return out;
}
