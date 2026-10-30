import katex from 'katex';

/**
 * Fórmulas con KaTeX (tipografía de LaTeX, como el editor de ecuaciones de Word).
 *
 * Los textos de `meta.ts` y los mensajes de `filter.ts` marcan las fórmulas así:
 *
 * - `$…$` — fórmula dentro de una frase: `donde $w(0,0)$ es…`.
 * - Una línea que empieza por `$$` — fórmula centrada en su propio renglón
 *   (solo en `MathText`). Varias líneas `$$` seguidas forman un bloque.
 *
 * Dentro de los `$` va sintaxis LaTeX: `\frac{a}{b}`, `x^{2}`, `z_5`, `\nabla`,
 * `\sqrt{…}`, `\begin{cases}…\end{cases}`, etc. En una cadena normal de
 * TypeScript la barra se escribe doble (`'\\nabla'`); en `String.raw` simple.
 */

function render(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    // El cirílico dentro de \text{…} no está en las fuentes de KaTeX: que use
    // la del sistema sin avisar por consola.
    strict: 'ignore',
  });
}

function Tex({ tex, display = false }: { tex: string; display?: boolean }) {
  return (
    <span
      // Una fórmula dentro de una frase no se parte entre dos renglones.
      className={display ? undefined : 'whitespace-nowrap'}
      dangerouslySetInnerHTML={{ __html: render(tex, display) }}
    />
  );
}

/** Una línea de texto con fórmulas `$…$` intercaladas. */
export function MathInline({ text }: { text: string }) {
  const parts = text.split(/\$([^$]+)\$/);
  return (
    <>
      {parts.map((part, idx) => (idx % 2 === 0 ? part : <Tex key={idx} tex={part} />))}
    </>
  );
}

type Block = { kind: 'p'; text: string } | { kind: 'math'; lines: string[] };

function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('$$')) {
      const tex = line.slice(2).trim();
      const last = blocks[blocks.length - 1];
      if (last?.kind === 'math') last.lines.push(tex);
      else blocks.push({ kind: 'math', lines: [tex] });
    } else {
      blocks.push({ kind: 'p', text: line });
    }
  }
  return blocks;
}

/**
 * Texto de varias líneas: cada línea normal es un párrafo y cada línea `$$`
 * una fórmula en su propio renglón.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {toBlocks(text).map((block, idx) =>
        block.kind === 'p' ? (
          <p key={idx} className="mt-1.5 first:mt-0">
            <MathInline text={block.text} />
          </p>
        ) : (
          <div
            key={idx}
            className="math-block my-2 rounded bg-zinc-100 px-2 py-1 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {block.lines.map((tex, n) => (
              <Tex key={n} tex={tex} display />
            ))}
          </div>
        ),
      )}
    </div>
  );
}
