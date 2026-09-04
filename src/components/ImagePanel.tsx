'use client';

import { useEffect, useRef } from 'react';
import { useLang } from '@/i18n/lang';
import { grayToImageData } from '@/lib/image/convert';
import type { GrayImage } from '@/lib/image/types';
import type { Bilingual } from '@/labs/types';

/** Un lienzo con su rótulo: Оригинал o Результат. */
interface ImagePanelProps {
  title: Bilingual;
  image: GrayImage | null;
  emptyHint?: Bilingual;
}

export default function ImagePanel({ title, image, emptyHint }: ImagePanelProps) {
  const { t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!image) {
      canvas.width = 0;
      canvas.height = 0;
      return;
    }

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.putImageData(grayToImageData(image), 0, 0);
  }, [image]);

  return (
    <figure className="flex min-w-0 flex-col gap-1">
      <figcaption className="flex items-baseline justify-between text-xs text-zinc-500">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {t(title)}
        </span>
        {image && (
          <span className="font-mono">
            {image.width}×{image.height}
          </span>
        )}
      </figcaption>

      <div className="flex min-h-48 items-center justify-center rounded border border-zinc-300 bg-[repeating-conic-gradient(#e4e4e7_0%_25%,#fafafa_0%_50%)] bg-[length:16px_16px] p-2 dark:border-zinc-800 dark:bg-[repeating-conic-gradient(#18181b_0%_25%,#27272a_0%_50%)]">
        {image ? (
          <canvas
            ref={canvasRef}
            className="max-h-[60vh] max-w-full object-contain [image-rendering:pixelated]"
          />
        ) : (
          <p className="px-4 py-8 text-center text-xs text-zinc-500">
            {emptyHint ? t(emptyHint) : '—'}
          </p>
        )}
      </div>
    </figure>
  );
}
