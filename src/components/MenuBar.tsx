'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useLang } from '@/i18n/lang';
import { labs } from '@/labs/registry';

/**
 * Barra superior del «formulario»: menús Файл ▾ y Преобразование ▾ y el
 * conmutador RU/ES. No sabe nada de imágenes; solo avisa al taller de lo que
 * se ha pulsado.
 *
 * «Преобразование» crece con cada laboratorio, como pide el enunciado: lista
 * las operaciones de los laboratorios marcados `implemented: true`.
 */
interface MenuBarProps {
  onOpen: () => void;
  onSave: () => void;
  canSave: boolean;
  /** Elegida una operación del menú «Преобразование». */
  onTransform: (slug: string, opKey: string) => void;
  /** Operación activa, para marcarla en el menú. */
  active?: { slug: string; opKey: string };
}

type MenuName = 'file' | 'transform';

export default function MenuBar({
  onOpen,
  onSave,
  canSave,
  onTransform,
  active,
}: MenuBarProps) {
  const { lang, toggle, t } = useLang();
  const [open, setOpen] = useState<MenuName | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const choose = (action: () => void) => {
    setOpen(null);
    action();
  };

  const implemented = labs.filter((lab) => lab.implemented);

  return (
    <header className="flex items-center gap-2 border-b border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href="/"
        className="mr-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        PixeLab
      </Link>

      <div className="flex items-center gap-1" ref={barRef}>
        <Menu
          label="Файл"
          isOpen={open === 'file'}
          onToggle={() => setOpen((v) => (v === 'file' ? null : 'file'))}
          onHover={() => open && setOpen('file')}
        >
          <MenuItem onClick={() => choose(onOpen)}>
            Открыть…
            <span className="ml-2 text-xs text-zinc-500">PNG / JPG</span>
          </MenuItem>
          <MenuItem disabled={!canSave} onClick={() => choose(onSave)}>
            Сохранить как PNG
          </MenuItem>
        </Menu>

        <Menu
          label="Преобразование"
          isOpen={open === 'transform'}
          onToggle={() => setOpen((v) => (v === 'transform' ? null : 'transform'))}
          onHover={() => open && setOpen('transform')}
        >
          {implemented.map((lab) =>
            lab.operations.map((op) => {
              const current = active?.slug === lab.slug && active.opKey === op.key;
              return (
                <MenuItem
                  key={`${lab.slug}:${op.key}`}
                  checked={current}
                  onClick={() => choose(() => onTransform(lab.slug, op.key))}
                >
                  {op.label.ru}
                  {lang === 'es' && (
                    <span className="ml-2 text-xs text-zinc-500">{op.label.es}</span>
                  )}
                </MenuItem>
              );
            }),
          )}
          {implemented.length === 0 && (
            <p className="px-3 py-1.5 text-xs text-zinc-500">
              {t({ ru: 'Пока пусто', es: 'Todavía vacío' })}
            </p>
          )}
        </Menu>
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

/** Un botón de la barra con su desplegable. */
function Menu({
  label,
  isOpen,
  onToggle,
  onHover,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onHover: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        onMouseEnter={onHover}
        className={
          isOpen
            ? 'rounded bg-zinc-200 px-2 py-1 dark:bg-zinc-800'
            : 'rounded px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800'
        }
      >
        {label} ▾
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-1 w-64 overflow-hidden rounded border border-zinc-300 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  onClick,
  disabled = false,
  checked = false,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  checked?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-baseline px-3 py-1.5 text-left enabled:hover:bg-zinc-100 disabled:text-zinc-400 dark:enabled:hover:bg-zinc-800 dark:disabled:text-zinc-600"
    >
      <span className="w-4 shrink-0 text-xs">{checked ? '✓' : ''}</span>
      <span>{children}</span>
    </button>
  );
}
