import type { LabDefinition, LabParam } from '@/labs/types';
import { laplacian, roberts, sobel } from './filter';

const normalize: LabParam = {
  key: 'normalize',
  label: { ru: 'Нормировать отклик', es: 'Normalizar la respuesta' },
  type: 'checkbox',
  default: true,
  hint: {
    ru: 'Растянуть максимум отклика до 255.',
    es: 'Escalar el máximo de la respuesta hasta 255.',
  },
};

export const lab05: LabDefinition = {
  id: 5,
  slug: 'gradients',
  temario: 'пп. 7–9',
  title: { ru: 'Градиентные операторы', es: 'Operadores de gradiente' },
  summary: {
    ru: 'Робертс, Собель и лапласиан.',
    es: 'Roberts, Sobel y laplaciano.',
  },
  theory: {
    ru: 'Границы объектов — это места резкого изменения яркости, поэтому их находят через производные. Операторы Робертса и Собеля вычисляют первую производную по двум направлениям и объединяют их в модуль градиента; маска Собеля больше, зато она усредняет вдоль границы и потому устойчивее к шуму. Лапласиан — вторая производная: он изотропен, реагирует на границу двойным откликом со сменой знака и сильно усиливает шум, поэтому его обычно применяют после сглаживания. Отклик может выходить за пределы [0, 255], и его либо нормируют, либо ограничивают.',
    es: 'Un contorno es un cambio brusco de brillo, así que se detecta derivando. Roberts y Sobel aproximan la primera derivada en dos direcciones y combinan ambas respuestas en el módulo del gradiente, normalmente con |Gx| + |Gy| para evitar la raíz cuadrada. La máscara de Roberts es 2×2, muy barata y muy sensible al ruido; la de Sobel es 3×3 y promedia en la dirección perpendicular al borde, lo que la hace bastante más robusta. El laplaciano es la segunda derivada: es isótropo, responde a cada borde con un par de picos de signo opuesto y amplifica el ruido, por lo que conviene suavizar antes con el Lab 4. Como la respuesta es con signo y puede salirse de [0, 255], hay que decidir entre normalizar el máximo a 255 o saturar directamente.',
  },
  operations: [
    {
      key: 'roberts',
      label: { ru: 'Робертс', es: 'Roberts' },
      params: [normalize],
      apply: roberts,
    },
    {
      key: 'sobel',
      label: { ru: 'Собель', es: 'Sobel' },
      params: [normalize],
      apply: sobel,
    },
    {
      key: 'laplacian',
      label: { ru: 'Лапласиан', es: 'Laplaciano' },
      params: [normalize],
      apply: laplacian,
    },
  ],
  implemented: false,
};
