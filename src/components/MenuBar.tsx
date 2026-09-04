'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/i18n/lang';

/**
 * Barra superior del «formulario»: menú Файл ▾ y conmutador RU/ES.
 * No sabe nada de imágenes; solo avisa al taller de lo que se ha pulsado.
 */
interface MenuBarProps {
  onOpen: () => void;
  onSave: () => void;
  canSave: boolean;
}

export default function MenuBar({ onOpen, onSave, canSave }: MenuBarProps) {
  const { lang, toggle } = useLang();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <header className="flex items-center gap-2 border-b border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href="/"
        className="mr-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        PixeLab
      </Link>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
        >
          Файл ▾
        </button>

        {open && (
          <div
            role="menu"
            className="absolute left-0 z-20 mt-1 w-56 overflow-hidden rounded border border-zinc-300 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onOpen();
              }}
              className="block w-full px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Открыть…
              <span className="ml-2 text-xs text-zinc-500">PNG / JPG</span>
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={!canSave}
              onClick={() => {
                setOpen(false);
                onSave();
              }}
              className="block w-full px-3 py-1.5 text-left enabled:hover:bg-zinc-100 disabled:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:disabled:text-zinc-600"
            >
              Сохранить как PNG
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        title={lang === 'ru' ? 'Сменить язык' : 'Cambiar de idioma'}
        className="ml-auto rounded border border-zinc-300 px-2 py-0.5 font-mono text-xs uppercase hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        {lang === 'ru' ? 'RU' : 'ES'}
      </button>
    </header>
  );
}
