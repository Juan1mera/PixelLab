import type { LabDefinition } from '@/labs/types';
import { globalThreshold, otsu } from './filter';

export const lab07: LabDefinition = {
  id: 7,
  slug: 'threshold',
  temario: 'пп. 12–13',
  title: { ru: 'Пороговая обработка', es: 'Umbralización' },
  summary: {
    ru: 'Глобальный порог и автоматический выбор по методу Оцу.',
    es: 'Umbral global y selección automática por el método de Otsu.',
  },
  theory: {
    ru: 'Пороговая обработка переводит полутоновое изображение в бинарное: пиксели ярче порога T становятся объектом, остальные — фоном. Если гистограмма бимодальна, порог естественно ставить во впадину между модами, но подбирать его вручную для каждого снимка неудобно. Метод Оцу выбирает T автоматически, максимизируя межклассовую дисперсию, что равносильно минимизации взвешенной суммы дисперсий внутри классов. Всё вычисление опирается только на гистограмму и выполняется за один проход по 256 уровням. Результат этого лабораторного — вход для морфологии в лабораторном 8.',
    es: 'La umbralización convierte una imagen en niveles de gris en una binaria: los píxeles por encima del umbral T pasan a objeto y el resto a fondo. Cuando el histograma es bimodal, el umbral natural está en el valle entre las dos modas, pero fijarlo a mano para cada imagen es poco práctico y nada reproducible. El método de Otsu lo elige solo: recorre todos los umbrales posibles y se queda con el que maximiza la varianza entre clases, lo que equivale a minimizar la suma ponderada de las varianzas internas de fondo y objeto. Todo el cálculo se hace sobre el histograma de 256 entradas, así que es independiente del tamaño de la imagen y muy rápido. Otsu supone iluminación uniforme y dos poblaciones bien separadas; con sombras o gradientes de fondo hace falta un umbral local. La salida de este laboratorio es justo la entrada que espera la morfología del Lab 8.',
  },
  operations: [
    {
      key: 'global',
      label: { ru: 'Глобальный порог', es: 'Umbral global' },
      params: [
        {
          key: 'threshold',
          label: { ru: 'Порог T', es: 'Umbral T' },
          type: 'slider',
          min: 0,
          max: 255,
          step: 1,
          default: 128,
          hint: {
            ru: 'Пиксели ярче T становятся белыми.',
            es: 'Los píxeles por encima de T pasan a blanco.',
          },
        },
      ],
      apply: globalThreshold,
    },
    {
      key: 'otsu',
      label: { ru: 'Метод Оцу', es: 'Método de Otsu' },
      apply: otsu,
    },
  ],
  showHistogram: true,
  implemented: false,
};
