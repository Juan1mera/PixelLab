import { at, clamp8, clone, createGray } from '@/lib/image/access';
import type { GrayImage } from '@/lib/image/types';
import { bool, num, str, type OperationResult, type ParamValues } from '@/labs/types';

/**
 * Повышение резкости с помощью градиента (Лб №3).
 *
 * Módulo del gradiente, aproximado por la suma de valores absolutos para no
 * calcular la raíz cuadrada en cada píxel:
 *
 *     |∇f| = √(Gx² + Gy²) ≈ |Gx| + |Gy|
 *
 * Vecindad 3×3 con la notación del enunciado (рис. 1, а): z5 es el píxel
 * central f(x, y), z1 = f(x − 1, y − 1), etc. Las filas de la ventana son
 * z1 z2 z3 / z4 z5 z6 / z7 z8 z9.
 *
 *   Простейший:  Gx = z8 − z5                     Gy = z6 − z5
 *   Робертс:     Gx = z9 − z5                     Gy = z8 − z6
 *   Собел:       Gx = (z7 + 2z8 + z9) − (z1 + 2z2 + z3)
 *                Gy = (z3 + 2z6 + z9) − (z1 + 2z4 + z7)
 *
 * Las sumas de coeficientes de todas las máscaras valen 0: en una zona de
 * brillo constante la respuesta es 0 y solo los contornos dan señal.
 *
 * Salida (`output`):
 *   - `sharpen`  повышение резкости: g = f + k·|∇f|, saturado con `clamp8`.
 *                Los contornos se aclaran y la imagen gana contraste local.
 *   - `edges`    выделение границ (рис. 2): g = |∇f|, con el máximo escalado
 *                a 255 si `normalize` está activo.
 *
 * Fuera de la imagen los vecinos se leen con `at(…, 'clamp')`, que repite el
 * píxel del borde: así el marco no genera un falso contorno.
 */

export type GradientOperator = 'simple' | 'roberts' | 'sobel';

/** |Gx| + |Gy| en cada píxel, sin saturar (Sobel llega hasta 2040). */
export function gradientMagnitude(
  src: GrayImage,
  operator: GradientOperator,
): Float32Array {
  const { width: w, height: h } = src;
  const out = new Float32Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const z1 = at(src, x - 1, y - 1);
      const z2 = at(src, x, y - 1);
      const z3 = at(src, x + 1, y - 1);
      const z4 = at(src, x - 1, y);
      const z5 = at(src, x, y);
      const z6 = at(src, x + 1, y);
      const z7 = at(src, x - 1, y + 1);
      const z8 = at(src, x, y + 1);
      const z9 = at(src, x + 1, y + 1);

      let gx: number;
      let gy: number;
      switch (operator) {
        case 'simple':
          gx = z8 - z5;
          gy = z6 - z5;
          break;
        case 'roberts':
          gx = z9 - z5;
          gy = z8 - z6;
          break;
        case 'sobel':
          gx = z7 + 2 * z8 + z9 - (z1 + 2 * z2 + z3);
          gy = z3 + 2 * z6 + z9 - (z1 + 2 * z4 + z7);
          break;
      }

      out[y * w + x] = Math.abs(gx) + Math.abs(gy);
    }
  }

  return out;
}

const OPERATOR_NAMES: Record<GradientOperator, { ru: string; es: string }> = {
  simple: { ru: 'Простейший', es: 'Simple' },
  roberts: { ru: 'Робертс', es: 'Roberts' },
  sobel: { ru: 'Собел', es: 'Sobel' },
};

function readOperator(params: ParamValues): GradientOperator {
  const value = str(params, 'operator', 'sobel');
  return value === 'simple' || value === 'roberts' ? value : 'sobel';
}

/**
 * Menú «Преобразование» → «Повышение резкости» → «Градиент».
 *
 * Pasos:
 *   1. Calcular |∇f| ≈ |Gx| + |Gy| con el operador elegido.
 *   2. `sharpen`: sumar k·|∇f| al original y saturar a [0, 255].
 *      `edges`:   escribir |∇f|, escalando el máximo a 255 si se pide.
 */
export function gradient(src: GrayImage, params: ParamValues): OperationResult {
  const operator = readOperator(params);
  const output = str(params, 'output', 'sharpen');
  const k = Math.max(num(params, 'k', 0.5), 0);

  const grad = gradientMagnitude(src, operator);

  let gMax = 0;
  for (let i = 0; i < grad.length; i++) {
    if (grad[i] > gMax) gMax = grad[i];
  }

  const name = OPERATOR_NAMES[operator];

  // Imagen de brillo constante: no hay contornos que realzar.
  if (gMax === 0) {
    return {
      image: output === 'edges' ? createGray(src.width, src.height) : clone(src),
      message: {
        ru: `${name.ru}: ∇f = 0 во всех точках (изображение однородное).`,
        es: `${name.es}: ∇f = 0 en todos los píxeles (imagen uniforme).`,
      },
    };
  }

  const out = createGray(src.width, src.height);

  if (output === 'edges') {
    const scale = bool(params, 'normalize', true) ? 255 / gMax : 1;
    for (let i = 0; i < grad.length; i++) {
      out.data[i] = clamp8(grad[i] * scale);
    }
    const text = `max |∇f| = ${Math.round(gMax)}`;
    return {
      image: out,
      message: {
        ru: `${name.ru} · границы · ${text}`,
        es: `${name.es} · contornos · ${text}`,
      },
    };
  }

  // Повышение резкости: g = f + k·|∇f|.
  for (let i = 0; i < grad.length; i++) {
    out.data[i] = clamp8(src.data[i] + k * grad[i]);
  }

  const text = `k = ${k.toFixed(2)} · max |∇f| = ${Math.round(gMax)}`;
  return {
    image: out,
    message: {
      ru: `${name.ru} · g = f + k·|∇f| · ${text}`,
      es: `${name.es} · g = f + k·|∇f| · ${text}`,
    },
  };
}
