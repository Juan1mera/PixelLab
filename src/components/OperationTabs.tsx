'use client';

import { useLang } from '@/i18n/lang';
import type { LabOperation } from '@/labs/types';

/** Pestañas cuando el laboratorio tiene más de una operación. */
interface OperationTabsProps {
  operations: readonly LabOperation[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function OperationTabs({
  operations,
  activeKey,
  onSelect,
}: OperationTabsProps) {
  const { t } = useLang();
  if (operations.length < 2) return null;

  return (
    <div role="tablist" className="flex flex-wrap gap-1">
      {operations.map((op) => {
        const active = op.key === activeKey;
        return (
          <button
            key={op.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(op.key)}
            className={
              active
                ? 'rounded border border-zinc-900 bg-zinc-900 px-2.5 py-1 text-xs text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'rounded border border-zinc-300 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }
          >
            {t(op.label)}
          </button>
        );
      })}
    </div>
  );
}
