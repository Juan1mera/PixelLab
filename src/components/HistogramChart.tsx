'use client';

import { useLang } from '@/i18n/lang';
import { LEVELS } from '@/lib/image/histogram';
import type { Bilingual } from '@/labs/types';

/**
 * Histograma en SVG, sin librerías: 256 barras escaladas al contador máximo.
 * Mientras `computeHistogram()` sea el esqueleto del Lab 6 llegan 256 ceros y
 * el panel lo dice en vez de dibujar una línea plana sin explicación.
 */
interface HistogramChartProps {
  histogram: Uint32Array;
  title: Bilingual;
}

const WIDTH = LEVELS;
const HEIGHT = 96;

export default function HistogramChart({ histogram, title }: HistogramChartProps) {
  const { t } = useLang();

  let max = 0;
  for (let k = 0; k < histogram.length; k++) {
    if (histogram[k] > max) max = histogram[k];
  }

  return (
    <figure className="flex flex-col gap-1">
      <figcaption className="flex items-baseline justify-between text-xs text-zinc-500">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {t(title)}
        </span>
        {max > 0 && <span className="font-mono">max {max}</span>}
      </figcaption>

      <div className="rounded border border-zinc-300 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-950">
        {max === 0 ? (
          <p className="py-6 text-center text-xs text-zinc-500">
            {t({
              ru: 'Гистограмма пока не вычисляется (лаб. 6).',
              es: 'El histograma aún no se calcula: es el Lab 6.',
            })}
          </p>
        ) : (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={t(title)}
            className="h-24 w-full"
          >
            {Array.from(histogram, (count, k) => {
              const h = (count / max) * HEIGHT;
              if (h <= 0) return null;
              return (
                <rect
                  key={k}
                  x={k}
                  y={HEIGHT - h}
                  width={1}
                  height={h}
                  className="fill-zinc-800 dark:fill-zinc-200"
                />
              );
            })}
          </svg>
        )}

        <div className="mt-1 flex justify-between font-mono text-[10px] text-zinc-400">
          <span>0</span>
          <span>128</span>
          <span>255</span>
        </div>
      </div>
    </figure>
  );
}
