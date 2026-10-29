# PixeLab

Aplicación web de procesamiento de imágenes para el practicum de **Методы и алгоритмы
обработки мультимедийных данных**. Cubre los 19 puntos del temario repartidos en
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
2. Elige la operación en el menú **Преобразование** (p. ej. «Негатив», «Степенное
   преобразование» o el submenú «Повышение резкости» → «Градиент» / «Лапласиан») o en las pestañas, y
   ajusta los parámetros del panel izquierdo. El menú crece con cada laboratorio
   implementado; si la operación es de otro laboratorio, navega
   hasta él conservando la imagen abierta y la aplica.
3. **Применить**, o deja el autopreview: recalcula solo tras 150 ms sin tocar nada. Viene
   activado salvo en el Lab 8.
4. **Файл → Сохранить как PNG** descarga el resultado.

El panel «Состояние» del lateral, justo debajo de la teoría, muestra el fichero cargado, las
dimensiones, el tiempo del último `apply` en milisegundos y el mensaje que devuelva la
operación (por ejemplo, el umbral que calcula Otsu). El conmutador RU/ES cambia el idioma de
la interfaz.

## Los laboratorios

La numeración sigue la de las prácticas del curso (carpetas `Лб_№N`): el Lab 3 es
«Повышение резкости с помощью градиента» y el Lab 4 «Повышение резкости с помощью
лапласиана». El suavizado, que ocupaba el hueco 4, queda como laboratorio 9 pendiente hasta
que salga su enunciado.

| # | Ruta | Operaciones | Temario |
| --- | --- | --- | --- |
| 1 | `/lab/negative` | negativo | п. 2 |
| 2 | `/lab/power` | potencia, s = (L−1)·(r/(L−1))^γ | п. 3 |
| 3 | `/lab/gradients` | realce de nitidez con el gradiente (simple, Roberts, Sobel): g = f + k·\|∇f\| | пп. 7–8 |
| 4 | `/lab/laplacian` | realce de nitidez con el laplaciano (máscaras de 4 y 8 vecinos, рис. 1–2): g = f ∓ ∇²f según w(0,0) | п. 9 |
| 5 | `/lab/slice` | corte de rango de brillos | п. 4 |
| 6 | `/lab/histogram` | ver histograma, ecualizar | пп. 10–11 |
| 7 | `/lab/threshold` | umbral global, Otsu | пп. 12–13 |
| 8 | `/lab/morphology` | dilatación, erosión, cierre, apertura, bordes, esqueleto | пп. 14–19 |
| 9 | `/lab/smoothing` | media, mediana (pendiente) | пп. 5–6 |

## Estructura

```
src/
├── app/                        rutas: índice y /lab/[slug]
├── lib/image/                  infraestructura de imagen
│   ├── types.ts                GrayImage, BorderMode
│   ├── convert.ts              ImageData ↔ GrayImage (luma BT.601)
│   ├── access.ts               at(), clone(), createGray(), clamp8()…
│   ├── io.ts                   fileToImageData(), downloadPng()
│   ├── session.ts              imagen abierta y operación pedida entre laboratorios
│   ├── convolve.ts             convolución (correlación) con máscara — Lab 4
│   ├── histogram.ts            TODO — contenido del Lab 6
│   └── morphology.ts           TODO — contenido del Lab 8
├── labs/
│   ├── types.ts                LabDefinition, LabOperation, LabParam, Bilingual
│   ├── registry.ts             los labs + getLabBySlug()
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
   `OperationResult` en vez de `GrayImage` y el mensaje sale en el panel «Состояние».
5. Borra la línea `/* eslint-disable @typescript-eslint/no-unused-vars … */` del principio
   del fichero en cuanto el cuerpo use `params`.
6. Pon `implemented: true` en el `meta.ts` del laboratorio: el badge del índice pasa a
   verde y la operación aparece en «Преобразование». Si el enunciado pide un submenú
   (p. ej. «Повышение резкости» → «Градиент»), indícalo con `menuGroup` en la operación.
7. `pnpm lint && pnpm build`, y etiqueta la entrega: `git tag lab-N`.

Los laboratorios 6 y 8 tienen además ayudantes compartidos en `src/lib/image`
(`histogram.ts`, `morphology.ts`) que hay que rellenar junto con el laboratorio
correspondiente; `convolve.ts` ya está implementado desde el Lab 4 y lo puede usar la media
del suavizado. El histograma que dibuja la interfaz sale de
`computeHistogram()`, así que el panel queda vacío hasta que se implemente el Lab 6.
