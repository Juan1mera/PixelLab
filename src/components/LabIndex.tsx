'use client';

import Link from 'next/link';
import { useLang } from '@/i18n/lang';
import { labs } from '@/labs/registry';

/** Índice: una tarjeta por laboratorio con su estado. */
export default function LabIndex() {
  const { lang, toggle, t } = useLang();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center gap-2 border-b border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          PixeLab
        </span>
        <button
          type="button"
          onClick={toggle}
          title={lang === 'ru' ? 'Сменить язык' : 'Cambiar de idioma'}
          className="ml-auto rounded border border-zinc-300 px-2 py-0.5 font-mono text-xs uppercase hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {lang === 'ru' ? 'RU' : 'ES'}
        </button>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {t({
            ru: 'Обработка изображений',
            es: 'Procesamiento de imágenes',
          })}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t({
            ru: 'Восемь лабораторных работ, 19 пунктов программы. Всё считается в браузере.',
            es: 'Ocho laboratorios que cubren los 19 puntos del temario. Todo se calcula en el navegador.',
          })}
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {labs.map((lab) => (
            <li key={lab.slug}>
              <Link
                href={`/lab/${lab.slug}`}
                className="flex h-full flex-col gap-1 rounded border border-zinc-300 p-3 transition-colors hover:border-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-zinc-500">
                    {t({ ru: 'Лаб.', es: 'Lab.' })} {lab.id} · {lab.temario}
                  </span>
                  <span
                    className={
                      lab.implemented
                        ? 'rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }
                  >
                    {lab.implemented
                      ? t({ ru: 'реализовано', es: 'implementado' })
                      : t({ ru: 'не реализовано', es: 'pendiente' })}
                  </span>
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {t(lab.title)}
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                  {t(lab.summary)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
