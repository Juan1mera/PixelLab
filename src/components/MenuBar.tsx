'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useLang, type Lang } from '@/i18n/lang';
import { labs } from '@/labs/registry';
import type { Bilingual, LabDefinition, LabOperation } from '@/labs/types';

/**
 * Barra superior del «formulario»: menús Файл ▾ y Преобразование ▾ y el
 * conmutador RU/ES. No sabe nada de imágenes; solo avisa al taller de lo que
 * se ha pulsado.
 *
 * «Преобразование» crece con cada laboratorio, como pide el enunciado: lista
 * las operaciones de los laboratorios marcados `implemented: true`. Las que
 * declaran `menuGroup` van en un submenú, p. ej. «Преобразование» →
 * «Повышение резкости» → «Градиент» (Лб №3).
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
  /** Submenú desplegado dentro de «Преобразование» (por su rótulo ruso). */
  const [openGroup, setOpenGroup] = useState<string | null>(null);
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
    setOpenGroup(null);
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
          onToggle={() => {
            setOpenGroup(null);
            setOpen((v) => (v === 'transform' ? null : 'transform'));
          }}
          onHover={() => open && setOpen('transform')}
        >
          {transformEntries(implemented).map((entry) =>
            entry.kind === 'item' ? (
              <TransformItem
                key={`${entry.item.slug}:${entry.item.op.key}`}
                item={entry.item}
                active={active}
                lang={lang}
                onChoose={(item) => choose(() => onTransform(item.slug, item.op.key))}
              />
            ) : (
              <Submenu
                key={entry.label.ru}
                label={entry.label}
                lang={lang}
                isOpen={openGroup === entry.label.ru}
                onOpen={() => setOpenGroup(entry.label.ru)}
                onToggle={() =>
                  setOpenGroup((g) => (g === entry.label.ru ? null : entry.label.ru))
                }
                checked={entry.items.some((item) => isActive(item, active))}
              >
                {entry.items.map((item) => (
                  <TransformItem
                    key={`${item.slug}:${item.op.key}`}
                    item={item}
                    active={active}
                    lang={lang}
                    onChoose={(chosen) =>
                      choose(() => onTransform(chosen.slug, chosen.op.key))
                    }
                  />
                ))}
              </Submenu>
            ),
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
          className="absolute left-0 z-20 mt-1 w-64 rounded border border-zinc-300 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
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

/** Una operación ofrecida en «Преобразование». */
interface TransformTarget {
  slug: string;
  op: LabOperation;
}

type TransformEntry =
  | { kind: 'item'; item: TransformTarget }
  | { kind: 'group'; label: Bilingual; items: TransformTarget[] };

/**
 * Aplana las operaciones de los laboratorios en entradas del menú. Las que
 * comparten `menuGroup` se juntan en un único submenú, colocado donde aparece
 * la primera de ellas.
 */
function transformEntries(implemented: readonly LabDefinition[]): TransformEntry[] {
  const entries: TransformEntry[] = [];
  const groups = new Map<string, TransformTarget[]>();

  for (const lab of implemented) {
    for (const op of lab.operations) {
      const item = { slug: lab.slug, op };
      if (!op.menuGroup) {
        entries.push({ kind: 'item', item });
        continue;
      }
      const existing = groups.get(op.menuGroup.ru);
      if (existing) {
        existing.push(item);
      } else {
        const items = [item];
        groups.set(op.menuGroup.ru, items);
        entries.push({ kind: 'group', label: op.menuGroup, items });
      }
    }
  }

  return entries;
}

function isActive(item: TransformTarget, active?: { slug: string; opKey: string }) {
  return active?.slug === item.slug && active.opKey === item.op.key;
}

function TransformItem({
  item,
  active,
  lang,
  onChoose,
}: {
  item: TransformTarget;
  active?: { slug: string; opKey: string };
  lang: Lang;
  onChoose: (item: TransformTarget) => void;
}) {
  return (
    <MenuItem checked={isActive(item, active)} onClick={() => onChoose(item)}>
      {item.op.label.ru}
      {lang === 'es' && (
        <span className="ml-2 text-xs text-zinc-500">{item.op.label.es}</span>
      )}
    </MenuItem>
  );
}

/** Entrada con flecha ▸ que despliega sus operaciones a la derecha. */
function Submenu({
  label,
  lang,
  isOpen,
  onOpen,
  onToggle,
  checked,
  children,
}: {
  label: Bilingual;
  lang: Lang;
  isOpen: boolean;
  onOpen: () => void;
  onToggle: () => void;
  checked: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen}>
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className={
          isOpen
            ? 'flex w-full items-baseline bg-zinc-100 px-3 py-1.5 text-left dark:bg-zinc-800'
            : 'flex w-full items-baseline px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }
      >
        <span className="w-4 shrink-0 text-xs">{checked ? '✓' : ''}</span>
        <span>
          {label.ru}
          {lang === 'es' && (
            <span className="ml-2 text-xs text-zinc-500">{label.es}</span>
          )}
        </span>
        <span className="ml-auto pl-2 text-xs text-zinc-500">▸</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-0 left-full z-30 -mt-1 ml-0.5 w-56 rounded border border-zinc-300 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        >
          {children}
        </div>
      )}
    </div>
  );
}
