import type { LabDefinition } from '@/labs/types';
import { slice } from './filter';

export const lab03: LabDefinition = {
  id: 3,
  slug: 'slice',
  temario: 'п. 4',
  title: { ru: 'Вырезание диапазона яркостей', es: 'Corte de rango de brillos' },
  summary: {
    ru: 'Выделение интервала [a, b] с сохранением фона или без него.',
    es: 'Resalta el intervalo [a, b] conservando el fondo o no.',
  },
  theory: {
    ru: 'Вырезание диапазона яркостей выделяет пиксели, попадающие в интервал [a, b], и по-разному обходится с остальными. В бинарном режиме фон обнуляется, и на выходе получается маска интересующей области. В режиме с сохранением фона остальные пиксели остаются без изменений, поэтому выделенная область читается в контексте всего снимка. Приём применяется, когда объект интереса занимает узкую полосу гистограммы: сосуды на снимке, дефекты на однородной поверхности, вода на аэрофотоснимке.',
    es: 'El corte de rango de brillos selecciona los píxeles cuyo nivel cae dentro del intervalo [a, b] y decide qué hacer con el resto. En modo binario el fondo se pone a 0 y la salida es una máscara de la región de interés, cómoda para encadenar con la morfología del Lab 8. En modo con fondo preservado los píxeles de fuera se copian tal cual, de modo que la zona resaltada se lee en el contexto de la imagen completa. Es útil cuando el objeto ocupa una franja estrecha del histograma: vasos en una radiografía, defectos sobre una superficie uniforme, láminas de agua en una foto aérea. La elección de a y b se apoya bien en el histograma del Lab 6.',
  },
  operations: [
    {
      key: 'slice',
      label: { ru: 'Вырезание', es: 'Corte' },
      params: [
        {
          key: 'min',
          label: { ru: 'Нижняя граница a', es: 'Límite inferior a' },
          type: 'slider',
          min: 0,
          max: 255,
          step: 1,
          default: 100,
        },
        {
          key: 'max',
          label: { ru: 'Верхняя граница b', es: 'Límite superior b' },
          type: 'slider',
          min: 0,
          max: 255,
          step: 1,
          default: 200,
        },
        {
          key: 'mode',
          label: { ru: 'Режим', es: 'Modo' },
          type: 'select',
          options: [
            {
              value: 'preserve',
              label: { ru: 'Сохранять фон', es: 'Conservar el fondo' },
            },
            {
              value: 'binary',
              label: { ru: 'Бинарный', es: 'Binario' },
            },
          ],
          default: 'preserve',
          hint: {
            ru: 'Что делать с пикселями вне интервала.',
            es: 'Qué hacer con los píxeles fuera del intervalo.',
          },
        },
      ],
      apply: slice,
    },
  ],
  implemented: false,
};
