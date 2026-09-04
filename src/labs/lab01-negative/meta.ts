import type { LabDefinition } from '@/labs/types';
import { negative } from './filter';

export const lab01: LabDefinition = {
  id: 1,
  slug: 'negative',
  temario: 'п. 2',
  title: { ru: 'Негатив изображения', es: 'Negativo de la imagen' },
  summary: {
    ru: 'Поточечное преобразование g = L − f.',
    es: 'Transformación punto a punto g = L − f.',
  },
  theory: {
    ru: 'Негатив — простейшее поточечное преобразование: яркость каждого пикселя заменяется на дополнение до максимума L. Здесь L — не 256, а наибольшая яркость, реально встречающаяся в изображении. Преобразование обратимо и не зависит от соседей, поэтому обрабатывается за один проход. Негатив удобен, когда важные детали спрятаны в тёмных областях: после инверсии они попадают в светлую часть диапазона, где глаз различает больше оттенков.',
    es: 'El negativo es la transformación punto a punto más simple: cada píxel se sustituye por su complemento respecto al máximo L. Aquí L no es 256, sino el brillo máximo que realmente aparece en la imagen, tal como lo define el enunciado. Al no depender de los vecinos, se resuelve en una sola pasada sobre el array y es exactamente reversible: aplicarlo dos veces devuelve el original. Es útil cuando el detalle interesante vive en las zonas oscuras, porque tras invertir cae en la parte clara del rango, donde el ojo distingue más matices. En imágenes médicas (radiografías) es el ajuste de visualización clásico.',
  },
  operations: [
    {
      key: 'negative',
      label: { ru: 'Негатив', es: 'Negativo' },
      apply: negative,
    },
  ],
  implemented: true,
};
