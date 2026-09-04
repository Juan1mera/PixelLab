'use client';

import type { ReactNode } from 'react';
import { useLang } from '@/i18n/lang';
import type { GrayImage } from '@/lib/image/types';
import type { Bilingual } from '@/labs/types';

/**
 * Panel de estado del lateral: qué imagen hay cargada, cuánto costó el último
 * `apply` y qué ha querido contar la operación.
 *
 * Vive junto a los controles, debajo de la teoría, en vez de en una barra
 * inferior: así el dato queda a la altura de la vista y con sitio para llevar
 * rótulo, que es lo que una tira de campos sueltos no permitía.
 */
interface StatusPanelProps {
  image: GrayImage | null;
  fileName: string | null;
  elapsedMs: number | null;
  message: Bilingual | null;
  warning: Bilingual | null;
  error: string | null;
}

export default function StatusPanel({
  image,
  fileName,
  elapsedMs,
  message,
  warning,
  error,
}: StatusPanelProps) {
  const { t } = useLang();

  return (
    <section className="rounded border border-zinc-300 text-xs dark:border-zinc-800">
      <h2 className="border-b border-zinc-200 px-2 py-1.5 font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        {t({ ru: 'Состояние', es: 'Estado' })}
      </h2>

      <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1.5 px-2 py-2">
        <Field label={{ ru: 'Файл', es: 'Archivo' }}>
          {fileName ? (
            <span className="block truncate" title={fileName}>
              {fileName}
            </span>
          ) : (
            <Empty />
          )}
        </Field>

        <Field label={{ ru: 'Размер', es: 'Tamaño' }}>
          {image ? (
            <span className="font-mono">
              {image.width}×{image.height} px
            </span>
          ) : (
            <Empty />
          )}
        </Field>

        <Field label={{ ru: 'Время', es: 'Tiempo' }}>
          {elapsedMs === null ? (
            <Empty />
          ) : (
            <span className="font-mono">
              {elapsedMs.toFixed(1)} {t({ ru: 'мс', es: 'ms' })}
            </span>
          )}
        </Field>
      </dl>

      {message && (
        <p className="border-t border-zinc-200 px-2 py-1.5 font-mono text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
          {t(message)}
        </p>
      )}

      {warning && (
        <p className="border-t border-amber-200 bg-amber-50 px-2 py-1.5 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          ⚠ {t(warning)}
        </p>
      )}

      {error && (
        <p className="border-t border-red-200 bg-red-50 px-2 py-1.5 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          ✕ {error}
        </p>
      )}
    </section>
  );
}

/** Una fila `rótulo → valor` de la lista de definición. */
function Field({
  label,
  children,
}: {
  label: Bilingual;
  children: ReactNode;
}) {
  const { t } = useLang();
  return (
    <>
      <dt className="text-zinc-500 dark:text-zinc-500">{t(label)}</dt>
      <dd className="min-w-0 text-zinc-800 dark:text-zinc-200">{children}</dd>
    </>
  );
}

/** Marca de «todavía no hay dato». */
function Empty() {
  return <span className="text-zinc-400 dark:text-zinc-600">—</span>;
}
