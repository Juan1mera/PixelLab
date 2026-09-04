import type { GrayImage } from '@/lib/image/types';

/**
 * Contratos que describen un laboratorio.
 *
 * `meta.ts` describe (títulos, parámetros, teoría) y `filter.ts` calcula
 * (funciones puras). La interfaz no sabe nada de ningún filtro concreto: monta
 * los controles leyendo `LabParam[]` y llama a `LabOperation.apply`.
 */

/** Cualquier rótulo visible: ruso para la interfaz, español para la ayuda. */
export interface Bilingual {
  ru: string;
  es: string;
}

/** Valores que puede tomar un parámetro de operación. */
export type ParamValue = number | string | boolean;

/** Mapa `clave → valor` que recibe `apply`. */
export type ParamValues = Readonly<Record<string, ParamValue>>;

export type LabParamType = 'slider' | 'number' | 'select' | 'checkbox';

/** Opción de un parámetro de tipo `select`. */
export interface LabParamOption {
  value: string;
  label: Bilingual;
}

/** Descripción de un control; `ParamControls` lo convierte en widget. */
export interface LabParam {
  key: string;
  label: Bilingual;
  type: LabParamType;
  /** `slider` y `number`. */
  min?: number;
  max?: number;
  step?: number;
  /** Solo `select`. */
  options?: LabParamOption[];
  default: ParamValue;
  hint?: Bilingual;
}

/** Resultado enriquecido: imagen más un mensaje para la barra de estado. */
export interface OperationResult {
  image: GrayImage;
  message?: Bilingual;
}

/** Una operación del laboratorio (una pestaña de la interfaz). */
export interface LabOperation {
  key: string;
  label: Bilingual;
  params?: LabParam[];
  /**
   * Función pura: no muta `src`. Devuelve la imagen procesada, o un
   * `OperationResult` si además quiere informar de algo (por ejemplo el umbral
   * que ha calculado Otsu).
   */
  apply: (src: GrayImage, params: ParamValues) => GrayImage | OperationResult;
}

/** Un laboratorio completo: lo que consume el índice y `LabWorkspace`. */
export interface LabDefinition {
  id: number;
  slug: string;
  /** Puntos del temario que cubre, p. ej. `'пп. 5–6'`. */
  temario: string;
  title: Bilingual;
  summary: Bilingual;
  theory: Bilingual;
  operations: LabOperation[];
  /** Muestra el histograma junto a los lienzos. */
  showHistogram?: boolean;
  /** `false` mientras los `apply` sigan siendo el esqueleto con TODO. */
  implemented: boolean;
}

/** Normaliza el valor devuelto por `apply` a la forma extendida. */
export function unwrap(result: GrayImage | OperationResult): OperationResult {
  return 'image' in result ? result : { image: result };
}

/** Lee un parámetro numérico; si falta o no es un número, usa `fallback`. */
export function num(params: ParamValues, key: string, fallback = 0): number {
  const value = params[key];
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/** Lee un parámetro de texto (típicamente el valor de un `select`). */
export function str(params: ParamValues, key: string, fallback = ''): string {
  const value = params[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
}

/** Lee un parámetro booleano (un `checkbox`). */
export function bool(params: ParamValues, key: string, fallback = false): boolean {
  const value = params[key];
  return typeof value === 'boolean' ? value : fallback;
}

/** Valores iniciales de una operación, tomados de `LabParam.default`. */
export function defaultParams(op: LabOperation): Record<string, ParamValue> {
  const values: Record<string, ParamValue> = {};
  for (const param of op.params ?? []) {
    values[param.key] = param.default;
  }
  return values;
}
