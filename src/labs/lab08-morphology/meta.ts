import type { LabDefinition, LabParam } from '@/labs/types';
import {
  boundary,
  closing,
  dilation,
  erosion,
  opening,
  skeleton,
} from './filter';

const seSize: LabParam = {
  key: 'seSize',
  label: { ru: 'Размер элемента', es: 'Tamaño del elemento' },
  type: 'select',
  options: [
    { value: '3', label: { ru: '3×3', es: '3×3' } },
    { value: '5', label: { ru: '5×5', es: '5×5' } },
    { value: '7', label: { ru: '7×7', es: '7×7' } },
  ],
  default: '3',
};

const seShape: LabParam = {
  key: 'seShape',
  label: { ru: 'Форма элемента', es: 'Forma del elemento' },
  type: 'select',
  options: [
    { value: 'square', label: { ru: 'Квадрат', es: 'Cuadrado' } },
    { value: 'cross', label: { ru: 'Крест', es: 'Cruz' } },
  ],
  default: 'square',
  hint: {
    ru: 'Крест сохраняет углы объектов лучше квадрата.',
    es: 'La cruz conserva mejor las esquinas que el cuadrado.',
  },
};

const structuring: LabParam[] = [seSize, seShape];

export const lab08: LabDefinition = {
  id: 8,
  slug: 'morphology',
  temario: 'пп. 14–19',
  title: { ru: 'Математическая морфология', es: 'Morfología matemática' },
  summary: {
    ru: 'Дилатация, эрозия, замыкание, размыкание, границы и скелет.',
    es: 'Dilatación, erosión, cierre, apertura, bordes y esqueleto.',
  },
  theory: {
    ru: 'Морфологические операции описывают форму объектов: изображение зондируется небольшим множеством — структурирующим элементом B. Дилатация расширяет объект и заполняет мелкие разрывы, эрозия сжимает его и убирает тонкие выступы; их композиции дают размыкание, которое удаляет мелкий шум, и замыкание, которое затягивает дыры. Разность исходного множества и его эрозии даёт границу объекта толщиной в один пиксель. Скелет получается последовательными эрозиями с накоплением остатков и сохраняет топологию фигуры при минимальном числе пикселей. Все эти операции определены для бинарных изображений, поэтому вход обычно готовит лабораторная 7.',
    es: 'La morfología matemática describe la forma de los objetos sondeando la imagen con un conjunto pequeño, el elemento estructurante B. La dilatación engorda el objeto y cierra pequeñas roturas, mientras que la erosión lo adelgaza y elimina salientes finos; al componerlas se obtienen la apertura, que borra el ruido de sal aislado sin cambiar el tamaño global, y el cierre, que rellena huecos y grietas. La diferencia entre el conjunto y su erosión da el contorno del objeto con un grosor de un píxel. El esqueleto se construye por erosiones sucesivas acumulando lo que la apertura no recupera, y resume la figura conservando su topología. La forma y el tamaño de B mandan sobre el resultado: la cruz respeta mejor las esquinas y el cuadrado actúa por igual en todas las direcciones. Todo esto está definido para imágenes binarias, así que la entrada la suele preparar el Lab 7.',
  },
  operations: [
    {
      key: 'dilation',
      label: { ru: 'Дилатация', es: 'Dilatación' },
      params: structuring,
      apply: dilation,
    },
    {
      key: 'erosion',
      label: { ru: 'Эрозия', es: 'Erosión' },
      params: structuring,
      apply: erosion,
    },
    {
      key: 'closing',
      label: { ru: 'Замыкание', es: 'Cierre' },
      params: structuring,
      apply: closing,
    },
    {
      key: 'opening',
      label: { ru: 'Размыкание', es: 'Apertura' },
      params: structuring,
      apply: opening,
    },
    {
      key: 'boundary',
      label: { ru: 'Границы', es: 'Bordes' },
      params: structuring,
      apply: boundary,
    },
    {
      key: 'skeleton',
      label: { ru: 'Скелет', es: 'Esqueleto' },
      params: [
        seSize,
        seShape,
        {
          key: 'maxIterations',
          label: { ru: 'Максимум итераций', es: 'Máximo de iteraciones' },
          type: 'number',
          min: 1,
          max: 1000,
          step: 1,
          default: 100,
          hint: {
            ru: 'Ограничение на число эрозий.',
            es: 'Tope de seguridad para el número de erosiones.',
          },
        },
      ],
      apply: skeleton,
    },
  ],
  implemented: false,
};
