# PixeLab

Aplicación web de procesamiento de imágenes para el practicum de **Методы и алгоритмы
обработки мультимедийных данных**. Cubre los 19 puntos del temario repartidos en 8
laboratorios independientes.

Todo ocurre en el navegador: no hay backend, ni rutas API, ni dependencias de
procesamiento. Las imágenes se manipulan a mano sobre `Uint8ClampedArray` y se pintan en
`<canvas>`.

## Cómo correrlo

```bash
pnpm install
pnpm dev
```

Después, <http://localhost:3000>. Otros comandos:

```bash
pnpm build
```

```bash
pnpm lint
```

Solo `pnpm`. La ruta del proyecto tiene espacios y cirílico: entrecomilla siempre las rutas
en la terminal.

## Cómo se usa

1. **Файл → Открыть** (o arrastra un fichero sobre los lienzos) para cargar una imagen.
   Se convierte a escala de grises con la luma BT.601 al entrar.
2. Elige la operación en las pestañas y ajusta los parámetros del panel izquierdo.
3. **Применить**, o deja el autopreview: recalcula solo tras 150 ms sin tocar nada. Viene
   activado salvo en el Lab 8.
4. **Файл → Сохранить как PNG** descarga el resultado.

La barra de estado inferior muestra las dimensiones, el tiempo del último `apply` en
milisegundos y el mensaje que devuelva la operación (por ejemplo, el umbral que calcula
Otsu). El conmutador RU/ES cambia el idioma de la interfaz.

## Los 8 laboratorios

| # | Ruta | Operaciones | Temario |
| --- | --- | --- | --- |
| 1 | `/lab/negative` | negativo | п. 2 |
| 2 | `/lab/power` | potencia | п. 3 |
| 3 | `/lab/slice` | corte de rango de brillos | п. 4 |
| 4 | `/lab/smoothing` | media, mediana | пп. 5–6 |
| 5 | `/lab/gradients` | Roberts, Sobel, laplaciano | пп. 7–9 |
| 6 | `/lab/histogram` | ver histograma, ecualizar | пп. 10–11 |
| 7 | `/lab/threshold` | umbral global, Otsu | пп. 12–13 |
| 8 | `/lab/morphology` | dilatación, erosión, cierre, apertura, bordes, esqueleto | пп. 14–19 |

## Estructura

```
src/
├── app/                        rutas: índice y /lab/[slug]
├── lib/image/                  infraestructura de imagen
│   ├── types.ts                GrayImage, BorderMode
│   ├── convert.ts              ImageData ↔ GrayImage (luma BT.601)
│   ├── access.ts               at(), clone(), createGray(), clamp8()…
│   ├── io.ts                   fileToImageData(), downloadPng()
│   ├── convolve.ts             TODO — contenido del Lab 4
│   ├── histogram.ts            TODO — contenido del Lab 6
│   └── morphology.ts           TODO — contenido del Lab 8
├── labs/
│   ├── types.ts                LabDefinition, LabOperation, LabParam, Bilingual
│   ├── registry.ts             los 8 labs + getLabBySlug()
│   └── labNN-<slug>/
│       ├── meta.ts             describe: títulos, parámetros, teoría
│       └── filter.ts           calcula: solo funciones puras
├── components/                 el «formulario»: menú, lienzos, controles
└── i18n/lang.tsx               LangProvider + useLang() → 'ru' | 'es'
```

`meta.ts` describe y `filter.ts` calcula. Un `filter.ts` no importa React ni nada de
`components/`; la interfaz no conoce ningún filtro concreto, monta los controles leyendo
`LabParam[]` y llama a `LabOperation.apply`.

## Receta para implementar un laboratorio

1. Abre `src/labs/labNN-<slug>/filter.ts`. El bloque de comentario de arriba tiene la
   fórmula y los pasos del algoritmo.
2. Sustituye el `return clone(src)` marcado con `TODO(lab-N)` por la implementación. La
   forma habitual son 10–30 líneas:

   ```ts
   export function negative(src: GrayImage, params: ParamValues): GrayImage {
     const out = createGray(src.width, src.height);
     const L = maxLevel(src);
     for (let i = 0; i < src.data.length; i++) {
       out.data[i] = L - src.data[i];
     }
     return out;
   }
   ```

3. Reglas que se aplican a todos:
   - `apply` es **pura**: no muta `src`, siempre `const out = createGray(w, h)`.
   - Dentro de una ventana de vecindad se lee con `at(img, x, y, mode)`, nunca con
     `data[y * w + x]` a pelo: `at()` es quien aplica la política de bordes.
   - Los parámetros se leen con los helpers tipados `num`, `str` y `bool` de
     `@/labs/types`. Nada de `any`.
   - Bucles planos: sin `map`/`filter` por píxel y sin crear objetos dentro del bucle.
     Si hay una tabla de 256 entradas que precalcular, se precalcula.
4. Si la operación quiere contar algo (un umbral, un número de iteraciones), devuelve
   `OperationResult` en vez de `GrayImage` y el mensaje sale en la barra de estado.
5. Borra la línea `/* eslint-disable @typescript-eslint/no-unused-vars … */` del principio
   del fichero en cuanto el cuerpo use `params`.
6. Pon `implemented: true` en el `meta.ts` del laboratorio: el badge del índice pasa a
   verde.
7. `pnpm lint && pnpm build`, y etiqueta la entrega: `git tag lab-N`.

Los laboratorios 4, 6 y 8 tienen además ayudantes compartidos en `src/lib/image`
(`convolve.ts`, `histogram.ts`, `morphology.ts`) que hay que rellenar junto con el
laboratorio correspondiente. El histograma que dibuja la interfaz sale de
`computeHistogram()`, así que el panel queda vacío hasta que se implemente el Lab 6.
