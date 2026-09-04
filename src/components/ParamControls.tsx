'use client';

import { useLang } from '@/i18n/lang';
import type { LabParam, ParamValue, ParamValues } from '@/labs/types';

/**
 * Genera los controles a partir de `LabParam[]`.
 * Añadir un parámetro a un laboratorio no toca este fichero.
 */
interface ParamControlsProps {
  params: readonly LabParam[];
  values: ParamValues;
  onChange: (key: string, value: ParamValue) => void;
}

export default function ParamControls({
  params,
  values,
  onChange,
}: ParamControlsProps) {
  const { t } = useLang();
  if (params.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {params.map((param) => (
        <label key={param.key} className="flex flex-col gap-1 text-xs">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {t(param.label)}
            </span>
            {param.type === 'slider' && (
              <span className="font-mono text-zinc-500">
                {String(values[param.key] ?? param.default)}
              </span>
            )}
          </span>

          <Control param={param} values={values} onChange={onChange} />

          {param.hint && <span className="text-zinc-500">{t(param.hint)}</span>}
        </label>
      ))}
    </div>
  );
}

interface ControlProps {
  param: LabParam;
  values: ParamValues;
  onChange: (key: string, value: ParamValue) => void;
}

function Control({ param, values, onChange }: ControlProps) {
  const { t } = useLang();
  const value = values[param.key] ?? param.default;

  switch (param.type) {
    case 'slider':
      return (
        <input
          type="range"
          min={param.min}
          max={param.max}
          step={param.step}
          value={Number(value)}
          onChange={(e) => onChange(param.key, Number(e.target.value))}
          className="w-full accent-zinc-900 dark:accent-zinc-100"
        />
      );

    case 'number':
      return (
        <input
          type="number"
          min={param.min}
          max={param.max}
          step={param.step}
          value={Number(value)}
          onChange={(e) => onChange(param.key, Number(e.target.value))}
          className="w-full rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
        />
      );

    case 'select':
      return (
        <select
          value={String(value)}
          onChange={(e) => onChange(param.key, e.target.value)}
          className="w-full rounded border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
        >
          {(param.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label)}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(param.key, e.target.checked)}
          className="size-4 self-start accent-zinc-900 dark:accent-zinc-100"
        />
      );
  }
}
