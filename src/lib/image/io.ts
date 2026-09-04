import { grayToImageData } from './convert';
import type { GrayImage } from './types';

/**
 * Entrada/salida de ficheros. Todo ocurre en el navegador: no hay backend.
 *
 * Abrir  → `File` → `ImageBitmap`/`HTMLImageElement` → `<canvas>` → `ImageData`
 * Guardar → `GrayImage` → `<canvas>` → `Blob` PNG → enlace de descarga
 */

/** Decodifica un fichero de imagen y devuelve sus píxeles RGBA. */
export async function fileToImageData(file: File): Promise<ImageData> {
  const bitmap = await decode(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas.');

  ctx.drawImage(bitmap, 0, 0);
  if ('close' in bitmap) bitmap.close();

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

type Decoded = ImageBitmap | HTMLImageElement;

async function decode(file: File): Promise<Decoded> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`No se pudo leer «${file.name}».`));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Descarga la imagen como PNG con el nombre indicado. */
export async function downloadPng(
  img: GrayImage,
  fileName = 'pixelab.png',
): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas.');
  ctx.putImageData(grayToImageData(img), 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  );
  if (!blob) throw new Error('No se pudo codificar el PNG.');

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.toLowerCase().endsWith('.png')
    ? fileName
    : `${fileName}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** `imagen.png` → `imagen-resultado.png`. Útil para el menú «Сохранить». */
export function resultFileName(original: string | null): string {
  if (!original) return 'pixelab.png';
  const dot = original.lastIndexOf('.');
  const stem = dot > 0 ? original.slice(0, dot) : original;
  return `${stem}-resultado.png`;
}
