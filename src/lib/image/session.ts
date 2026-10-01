import type { GrayImage } from './types';

/**
 * Memoria de la sesión entre laboratorios.
 *
 * Cada ruta `/lab/[slug]` monta su propio taller, así que sin esto la imagen
 * abierta se perdería al elegir en el menú «Преобразование» una operación de
 * otro laboratorio. Vive en el módulo (no en `localStorage`): la navegación de
 * Next en el cliente conserva los módulos, y una recarga empieza de cero.
 */

interface StoredImage {
  image: GrayImage;
  fileName: string | null;
}

interface PendingOperation {
  slug: string;
  opKey: string;
}

let storedImage: StoredImage | null = null;
let pendingOperation: PendingOperation | null = null;

/** Guarda la imagen original abierta con «Файл → Открыть». */
export function rememberImage(image: GrayImage, fileName: string | null): void {
  storedImage = { image, fileName };
}

/** Última imagen abierta en cualquier laboratorio, o `null`. */
export function recallImage(): StoredImage | null {
  return storedImage;
}

/** Pide que el laboratorio `slug` ejecute `opKey` nada más montarse. */
export function requestOperation(slug: string, opKey: string): void {
  pendingOperation = { slug, opKey };
}

/** Operación pendiente para `slug`, sin consumirla (seguro en StrictMode). */
export function peekOperation(slug: string): string | null {
  return pendingOperation?.slug === slug ? pendingOperation.opKey : null;
}

/** Descarta la operación pendiente una vez atendida. */
export function clearOperation(): void {
  pendingOperation = null;
}
