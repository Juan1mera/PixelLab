'use client';

import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from 'react';
import HistogramChart from '@/components/HistogramChart';
import ImagePanel from '@/components/ImagePanel';
import LabNav from '@/components/LabNav';
import MenuBar from '@/components/MenuBar';
import OperationTabs from '@/components/OperationTabs';
import ParamControls from '@/components/ParamControls';
import StatusPanel from '@/components/StatusPanel';
import { useLang } from '@/i18n/lang';
import { isBinary } from '@/lib/image/access';
import { imageDataToGray } from '@/lib/image/convert';
import { computeHistogram } from '@/lib/image/histogram';
import { downloadPng, fileToImageData, resultFileName } from '@/lib/image/io';
import {
  clearOperation,
  peekOperation,
  recallImage,
  rememberImage,
  requestOperation,
} from '@/lib/image/session';
import type { GrayImage } from '@/lib/image/types';
import { getLabBySlug } from '@/labs/registry';
import {
  defaultParams,
  unwrap,
  type Bilingual,
  type LabDefinition,
  type LabOperation,
  type ParamValue,
} from '@/labs/types';

/** Retardo del autopreview, en milisegundos. */
const DEBOUNCE_MS = 150;

/**
 * El «formulario» del enunciado: menú, lienzos, parámetros y barra de estado.
 *
 * Recibe el `slug` y resuelve el laboratorio aquí, en el cliente: el registro
 * contiene funciones y no puede cruzar la frontera servidor → cliente.
 */
export default function LabWorkspace({ slug }: { slug: string }) {
  const lab = getLabBySlug(slug);

  if (!lab) {
    return (
      <main className="p-6 text-sm text-red-700 dark:text-red-400">
        Laboratorio desconocido: {slug}
      </main>
    );
  }

  // `key` evita que el estado de un laboratorio se cuele en el siguiente
  // cuando Next reutiliza el componente al navegar entre slugs.
  return <Workspace key={lab.slug} lab={lab} />;
}

/** Estado con el que arranca el taller al montarse. */
interface Bootstrap {
  source: GrayImage | null;
  fileName: string | null;
  opKey: string;
  result: GrayImage | null;
  message: Bilingual | null;
  elapsedMs: number | null;
  error: string | null;
}

/**
 * Recupera la imagen abierta en otro laboratorio y, si se llegó aquí desde el
 * menú «Преобразование», ejecuta ya la operación pedida. `apply` es pura, así
 * que calcularla durante la inicialización del estado es seguro.
 */
function bootstrap(lab: LabDefinition): Bootstrap {
  const stored = recallImage();
  const pendingKey = peekOperation(lab.slug);
  const op = lab.operations.find((o) => o.key === pendingKey);

  const state: Bootstrap = {
    source: stored?.image ?? null,
    fileName: stored?.fileName ?? null,
    opKey: op?.key ?? lab.operations[0].key,
    result: null,
    message: null,
    elapsedMs: null,
    error: null,
  };

  if (op && stored) {
    const start = performance.now();
    try {
      const output = unwrap(op.apply(stored.image, defaultParams(op)));
      state.result = output.image;
      state.message = output.message ?? null;
    } catch (cause) {
      state.error = cause instanceof Error ? cause.message : String(cause);
    }
    state.elapsedMs = performance.now() - start;
  }

  return state;
}

function Workspace({ lab }: { lab: LabDefinition }) {
  const { t } = useLang();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initial] = useState(() => bootstrap(lab));

  const [source, setSource] = useState<GrayImage | null>(initial.source);
  const [result, setResult] = useState<GrayImage | null>(initial.result);
  const [fileName, setFileName] = useState<string | null>(initial.fileName);
  const [opKey, setOpKey] = useState(initial.opKey);
  const [values, setValues] = useState<Record<string, Record<string, ParamValue>>>(
    () => {
      const defaults: Record<string, Record<string, ParamValue>> = {};
      for (const op of lab.operations) defaults[op.key] = defaultParams(op);
      return defaults;
    },
  );
  // El Lab 8 encadena operaciones caras sobre imágenes binarias: ahí el
  // autopreview molesta más que ayuda.
  const [autoPreview, setAutoPreview] = useState(lab.id !== 8);
  const [elapsedMs, setElapsedMs] = useState<number | null>(initial.elapsedMs);
  const [message, setMessage] = useState<Bilingual | null>(initial.message);
  const [error, setError] = useState<string | null>(initial.error);
  const [dragging, setDragging] = useState(false);

  const operation =
    lab.operations.find((op) => op.key === opKey) ?? lab.operations[0];

  // La operación pendiente ya se atendió en `bootstrap`.
  useEffect(() => {
    clearOperation();
  }, []);

  const openFile = useCallback(async (file: File) => {
    try {
      const gray = imageDataToGray(await fileToImageData(file));
      rememberImage(gray, file.name);
      setSource(gray);
      setResult(null);
      setFileName(file.name);
      setElapsedMs(null);
      setMessage(null);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }, []);

  const runOperation = useCallback(
    (op: LabOperation) => {
      if (!source) return;

      const start = performance.now();
      try {
        const output = unwrap(op.apply(source, values[op.key] ?? {}));
        setElapsedMs(performance.now() - start);
        setResult(output.image);
        setMessage(output.message ?? null);
        setError(null);
      } catch (cause) {
        setElapsedMs(performance.now() - start);
        setResult(null);
        setMessage(null);
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    },
    [source, values],
  );

  const run = useCallback(() => runOperation(operation), [runOperation, operation]);

  /** Menú «Преобразование»: misma página → ejecutar; otra → navegar y ejecutar. */
  const onTransform = (slug: string, key: string) => {
    if (slug === lab.slug) {
      const op = lab.operations.find((o) => o.key === key);
      if (!op) return;
      setOpKey(op.key);
      runOperation(op);
      return;
    }
    requestOperation(slug, key);
    router.push(`/lab/${slug}`);
  };

  useEffect(() => {
    if (!autoPreview || !source) return;
    const timer = window.setTimeout(run, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [autoPreview, source, run]);

  const shown = result ?? source;

  const histogram = useMemo(
    () => (lab.showHistogram && shown ? computeHistogram(shown) : null),
    [lab.showHistogram, shown],
  );

  const warning = useMemo<Bilingual | null>(() => {
    if (lab.id !== 8 || !source || isBinary(source)) return null;
    return {
      ru: 'Изображение не бинарное: сначала примените порог (лаб. 7).',
      es: 'La imagen no es binaria: pasa antes por el umbral del Lab 7.',
    };
  }, [lab.id, source]);

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files.item(0);
    if (file) void openFile(file);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col"
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <MenuBar
        onOpen={() => fileInputRef.current?.click()}
        onSave={() => {
          if (shown) void downloadPng(shown, resultFileName(fileName));
        }}
        canSave={Boolean(shown)}
        onTransform={onTransform}
        active={{ slug: lab.slug, opKey: operation.key }}
      />
      <LabNav activeSlug={lab.slug} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void openFile(file);
          event.target.value = '';
        }}
      />

      <main className="grid flex-1 gap-4 p-4 lg:grid-cols-[20rem_1fr]">
        <aside className="flex flex-col gap-4">
          <div>
            <p className="font-mono text-xs text-zinc-500">
              {t({ ru: 'Лаб.', es: 'Lab.' })} {lab.id} · {lab.temario}
            </p>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t(lab.title)}
            </h1>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {t(lab.summary)}
            </p>
            <span
              className={
                lab.implemented
                  ? 'mt-2 inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'mt-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }
            >
              {lab.implemented
                ? t({ ru: 'реализовано', es: 'implementado' })
                : t({ ru: 'не реализовано', es: 'pendiente' })}
            </span>
          </div>

          <details className="rounded border border-zinc-300 p-2 text-xs dark:border-zinc-800">
            <summary className="cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
              {t({ ru: 'Теория', es: 'Teoría' })}
            </summary>
            <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t(lab.theory)}
            </p>
          </details>

          <StatusPanel
            image={shown}
            fileName={fileName}
            elapsedMs={elapsedMs}
            message={message}
            warning={warning}
            error={error}
          />

          <OperationTabs
            operations={lab.operations}
            activeKey={operation.key}
            onSelect={setOpKey}
          />

          <ParamControls
            params={operation.params ?? []}
            values={values[operation.key] ?? {}}
            onChange={(key, value) =>
              setValues((current) => ({
                ...current,
                [operation.key]: { ...current[operation.key], [key]: value },
              }))
            }
          />

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={run}
              disabled={!source}
              className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white disabled:bg-zinc-300 dark:bg-zinc-100 dark:text-zinc-900 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
            >
              Применить
            </button>
            <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={autoPreview}
                onChange={(event) => setAutoPreview(event.target.checked)}
                className="size-4 accent-zinc-900 dark:accent-zinc-100"
              />
              {t({
                ru: 'Автопросмотр (150 мс)',
                es: 'Vista previa automática (150 ms)',
              })}
            </label>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-4">
          <div
            className={
              dragging
                ? 'grid gap-4 rounded border-2 border-dashed border-zinc-500 p-2 md:grid-cols-2'
                : 'grid gap-4 rounded border-2 border-dashed border-transparent p-2 md:grid-cols-2'
            }
          >
            <ImagePanel
              title={{ ru: 'Оригинал', es: 'Original' }}
              image={source}
              emptyHint={{
                ru: 'Файл → Открыть, или перетащите изображение сюда.',
                es: 'Файл → Открыть, o arrastra una imagen hasta aquí.',
              }}
            />
            <ImagePanel
              title={{ ru: 'Результат', es: 'Resultado' }}
              image={result}
              emptyHint={{
                ru: 'Нажмите «Применить».',
                es: 'Pulsa «Применить».',
              }}
            />
          </div>

          {histogram && (
            <HistogramChart
              histogram={histogram}
              title={{
                ru: result ? 'Гистограмма результата' : 'Гистограмма оригинала',
                es: result ? 'Histograma del resultado' : 'Histograma del original',
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}
