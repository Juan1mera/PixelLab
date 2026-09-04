'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { Bilingual } from '@/labs/types';

/**
 * Idioma de la interfaz.
 *
 * Los rótulos operativos van en ruso porque el informe es en ruso; las ayudas
 * y la teoría, en español. `t()` elige la cadena de un `Bilingual`.
 *
 * La preferencia vive en `localStorage`, fuera de React, y se lee con
 * `useSyncExternalStore`: durante la hidratación React usa la instantánea del
 * servidor (`ru`) y luego reconcilia con la del cliente, así que no hay ni
 * desajuste de hidratación ni `setState` dentro de un efecto.
 */
export type Lang = 'ru' | 'es';

const STORAGE_KEY = 'pixelab:lang';
const DEFAULT_LANG: Lang = 'ru';

function readStored(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'ru' || saved === 'es' ? saved : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

let currentLang: Lang = readStored();
const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function getSnapshot(): Lang {
  return currentLang;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

function writeLang(lang: Lang): void {
  if (lang === currentLang) return;
  currentLang = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Modo privado o almacenamiento lleno: la sesión sigue funcionando.
  }
  for (const listener of listeners) listener();
}

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (text: Bilingual) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    writeLang(getSnapshot() === 'ru' ? 'es' : 'ru');
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang: writeLang,
      toggle,
      t: (text: Bilingual) => text[lang],
    }),
    [lang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang() debe usarse dentro de <LangProvider>.');
  return ctx;
}
