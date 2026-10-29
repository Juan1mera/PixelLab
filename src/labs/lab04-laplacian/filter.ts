import { clamp8, clone, createGray } from '@/lib/image/access';
import { centerWeight, convolveRaw, kernel, type Kernel } from '@/lib/image/convolve';
import type { GrayImage } from '@/lib/image/types';
import { bool, num, str, type OperationResult, type ParamValues } from '@/labs/types';

/**
 * Повышение резкости с помощью лапласиана (Лб №4).
 *
 * Лапласиан функции двух переменных:
 *
 *     ∇²f = ∂²f/∂x² + ∂²f/∂y²
 *
 * En forma discreta (ecuaciones (1)–(3) del enunciado):
 *
 *     ∂²f/∂x² = f(x + 1, y) + f(x − 1, y) − 2f(x, y)                     (1)
 *     ∂²f/∂y² = f(x, y + 1) + f(x, y − 1) − 2f(x, y)                     (2)
 *     ∇²f = f(x + 1, y) + f(x − 1, y) + f(x, y + 1) + f(x, y − 1) − 4f(x, y)   (3)
 *
 * Máscaras (рис. 1 y рис. 2):
 *
 *   рис. 1, а   0  1  0     рис. 1, б   1  1  1
 *               1 −4  1                 1 −8  1
 *               0  1  0                 1  1  1
 *
 *   рис. 2, а   0 −1  0     рис. 2, б  −1 −1 −1
 *              −1  4 −1                −1  8 −1
 *               0 −1  0                −1 −1 −1
 *
 * Las de la columna «а» son isótropas para giros múltiplos de 90°; las de la
 * «б» añaden las dos diagonales (−8f(x, y) en el centro) y lo son para
 * múltiplos de 45°. Las del рис. 2 son el laplaciano «negativo» de las del
 * рис. 1: dan el mismo resultado con el signo cambiado.
 *
 * Обобщённый алгоритм (w(0,0) es el coeficiente central de la máscara):
 *
 *     g(x, y) = f(x, y) − ∇²f(x, y),   если w(0,0) < 0
 *     g(x, y) = f(x, y) + ∇²f(x, y),   если w(0,0) ≥ 0
 *
 * Se añade un peso k (por defecto 1, que es exactamente la fórmula anterior):
 * g = f ∓ k·∇²f. El resultado se satura a [0, 255] con `clamp8`.
 *
 * Salida (`output`):
 *   - `sharpen`    повышение резкости: g según el algoritmo generalizado.
 *   - `laplacian`  solo ∇²f (рис. 3): saturado a [0, 255] —líneas grisáceas
 *                  sobre fondo oscuro— o escalado linealmente min…max → 0…255
 *                  si `normalize` está activo.
 *
 * Fuera de la imagen los vecinos se leen con `at(…, 'clamp')` (dentro de
 * `convolveRaw`), que repite el píxel del borde: el marco no crea contornos.
 */

export type LaplacianMask = '1a' | '1b' | '2a' | '2b';

export const LAPLACIAN_MASKS: Record<LaplacianMask, Kernel> = {
  '1a': kernel(3, 3, [0, 1, 0, 1, -4, 1, 0, 1, 0]),
  '1b': kernel(3, 3, [1, 1, 1, 1, -8, 1, 1, 1, 1]),
  '2a': kernel(3, 3, [0, -1, 0, -1, 4, -1, 0, -1, 0]),
  '2b': kernel(3, 3, [-1, -1, -1, -1, 8, -1, -1, -1, -1]),
};

const MASK_NAMES: Record<LaplacianMask, { ru: string; es: string }> = {
  '1a': { ru: 'Рис. 1, а', es: 'Fig. 1a' },
  '1b': { ru: 'Рис. 1, б', es: 'Fig. 1b' },
  '2a': { ru: 'Рис. 2, а', es: 'Fig. 2a' },
  '2b': { ru: 'Рис. 2, б', es: 'Fig. 2b' },
};

/** Entero con el signo menos tipográfico (−), como en el enunciado. */
function fmt(value: number): string {
  const n = Math.round(value);
  return n < 0 ? `−${-n}` : String(n);
}

function readMask(params: ParamValues): LaplacianMask {
  const value = str(params, 'mask', '1a');
  return value === '1b' || value === '2a' || value === '2b' ? value : '1a';
}

/** ∇²f en cada píxel, con signo y sin saturar. */
export function laplacianResponse(src: GrayImage, mask: LaplacianMask): Float32Array {
  return convolveRaw(src, LAPLACIAN_MASKS[mask], 'clamp');
}

/**
 * Menú «Преобразование» → «Повышение резкости» → «Лапласиан».
 *
 * Pasos:
 *   1. Calcular ∇²f con la máscara elegida.
 *   2. `sharpen`:   g = f − k·∇²f si w(0,0) < 0, g = f + k·∇²f si w(0,0) ≥ 0;
 *                   saturar a [0, 255].
 *      `laplacian`: escribir ∇²f saturado, o escalado min…max → 0…255.
 */
export function laplacian(src: GrayImage, params: ParamValues): OperationResult {
  const mask = readMask(params);
  const output = str(params, 'output', 'sharpen');
  const k = Math.max(num(params, 'k', 1), 0);

  const lap = laplacianResponse(src, mask);
  const w00 = centerWeight(LAPLACIAN_MASKS[mask]);

  let lMin = Infinity;
  let lMax = -Infinity;
  for (let i = 0; i < lap.length; i++) {
    if (lap[i] < lMin) lMin = lap[i];
    if (lap[i] > lMax) lMax = lap[i];
  }

  const name = MASK_NAMES[mask];
  const range = `∇²f ∈ [${fmt(lMin)}, ${fmt(lMax)}]`;
  const center = `w(0,0) = ${fmt(w00)}`;

  // Imagen de brillo constante: ∇²f = 0 en todas partes.
  if (lMin === 0 && lMax === 0) {
    return {
      image: output === 'laplacian' ? createGray(src.width, src.height) : clone(src),
      message: {
        ru: `${name.ru}: ∇²f = 0 во всех точках (изображение однородное).`,
        es: `${name.es}: ∇²f = 0 en todos los píxeles (imagen uniforme).`,
      },
    };
  }

  const out = createGray(src.width, src.height);

  if (output === 'laplacian') {
    const normalize = bool(params, 'normalize', false);
    if (normalize) {
      const scale = 255 / (lMax - lMin);
      for (let i = 0; i < lap.length; i++) {
        out.data[i] = clamp8((lap[i] - lMin) * scale);
      }
    } else {
      for (let i = 0; i < lap.length; i++) {
        out.data[i] = clamp8(lap[i]);
      }
    }
    return {
      image: out,
      message: {
        ru: `${name.ru} · ${center} · лапласиан${normalize ? ' (нормирован)' : ''} · ${range}`,
        es: `${name.es} · ${center} · laplaciano${normalize ? ' (normalizado)' : ''} · ${range}`,
      },
    };
  }

  // Обобщённый алгоритм: знак определяется центральным коэффициентом маски.
  const sign = w00 < 0 ? -1 : 1;
  const factor = sign * k;
  for (let i = 0; i < lap.length; i++) {
    out.data[i] = clamp8(src.data[i] + factor * lap[i]);
  }

  const formula = sign < 0 ? 'g = f − k·∇²f' : 'g = f + k·∇²f';
  const text = `${center} · ${formula} · k = ${k.toFixed(2)} · ${range}`;
  return {
    image: out,
    message: {
      ru: `${name.ru} · ${text}`,
      es: `${name.es} · ${text}`,
    },
  };
}
