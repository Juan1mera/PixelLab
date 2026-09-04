'use client';

import { useLang } from '@/i18n/lang';
import type { GrayImage } from '@/lib/image/types';
import type { Bilingual } from '@/labs/types';

/** Barra de estado: dimensiones, tiempo del último apply y mensajes. */
interface StatusBarProps {
  image: GrayImage | null;
  fileName: string | null;
  elapsedMs: number | null;
  message: Bilingual | null;
  warning: Bilingual | null;
  error: string | null;
}

export default function StatusBar({
  image,
  fileName,
  elapsedMs,
  message,
  warning,
  error,
}: StatusBarProps) {
  const { t } = useLang();

  return (
    <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-300 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      <span className="font-mono">
        {image ? `${image.width}×${image.height} px` : t({ ru: 'нет изображения', es: 'sin imagen' })}
      </span>

      {fileName && <span className="truncate max-w-[16rem]">{fileName}</span>}

      <span className="font-mono">
        {elapsedMs === null ? '— ms' : `${elapsedMs.toFixed(1)} ms`}
      </span>

      {message && <span className="text-zinc-800 dark:text-zinc-200">{t(message)}</span>}

      {warning && <span className="text-amber-700 dark:text-amber-400">⚠ {t(warning)}</span>}

      {error && <span className="text-red-700 dark:text-red-400">✕ {error}</span>}
    </footer>
  );
}
