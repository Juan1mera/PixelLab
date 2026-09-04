/* eslint-disable @typescript-eslint/no-unused-vars -- los stubs aún no leen `params`. */
import { clone } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import type { OperationResult, ParamValues } from '@/labs/types';

/**
 * Binarización por umbral (пп. 12–13).
 *
 * Umbral global, con T fijado a mano:
 *
 *     g(x, y) = 255  si f(x, y) > T
 *     g(x, y) = 0    en otro caso
 *
 * Método de Otsu: elige T maximizando la varianza entre clases. Partiendo del
 * histograma normalizado p(k), para cada T ∈ [0, 254]:
 *
 *     ω₀(T) = Σ_{k≤T} p(k)                 ω₁(T) = 1 − ω₀(T)
 *     μ(T)  = Σ_{k≤T} k · p(k)             μ_T   = Σ_k k · p(k)
 *     σ²_b(T) = (μ_T · ω₀ − μ)² / (ω₀ · ω₁)
 *
 * y se queda con el T que maximiza σ²_b. Maximizar la varianza entre clases
 * equivale a minimizar la suma ponderada de las varianzas internas, es decir,
 * a partir el histograma por donde mejor se separan fondo y objeto.
 *
 * Pasos de `otsu`:
 *   1. `computeHistogram(src)` y la media total μ_T.
 *   2. Un solo barrido de k = 0..254 arrastrando ω₀ y μ de forma incremental.
 *   3. Binarizar con el T ganador y devolver `{ image, message }` con su valor,
 *      para que la barra de estado lo muestre.
 */
export function globalThreshold(src: GrayImage, params: ParamValues): GrayImage {
  // TODO(lab-7): implementar la binarización con el umbral T del parámetro.
  return clone(src);
}

export function otsu(src: GrayImage, params: ParamValues): OperationResult {
  // TODO(lab-7): calcular T por Otsu, binarizar y devolverlo en `message`.
  return { image: clone(src) };
}
