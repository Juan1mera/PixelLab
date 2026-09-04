'use client';

import Link from 'next/link';
import { useLang } from '@/i18n/lang';
import { labs } from '@/labs/registry';

/** Navegación entre los ocho laboratorios. */
export default function LabNav({ activeSlug }: { activeSlug?: string }) {
  const { t } = useLang();

  return (
    <nav className="flex flex-wrap items-center gap-1 border-b border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {labs.map((lab) => {
        const active = lab.slug === activeSlug;
        return (
          <Link
            key={lab.slug}
            href={`/lab/${lab.slug}`}
            title={t(lab.title)}
            aria-current={active ? 'page' : undefined}
            className={
              active
                ? 'rounded bg-zinc-900 px-2.5 py-1 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'rounded px-2.5 py-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }
          >
            <span className="font-mono text-xs">{lab.id}</span>
            <span className="ml-1.5 hidden sm:inline">{t(lab.title)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
