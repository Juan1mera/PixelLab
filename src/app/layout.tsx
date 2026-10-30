import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LangProvider } from '@/i18n/lang';
import 'katex/dist/katex.min.css';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'PixeLab',
  description:
    'Обработка изображений: восемь лабораторных работ по методам и алгоритмам обработки мультимедийных данных.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/*
        Extensiones del navegador (p. ej. ColorZilla añade `cz-shortcut-listen`)
        tocan los atributos de <body> antes de que cargue React; esto solo
        silencia esa diferencia de atributos en <body>, no en sus hijos.
      */}
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
      >
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
