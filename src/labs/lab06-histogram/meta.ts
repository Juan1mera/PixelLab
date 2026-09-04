import type { LabDefinition } from '@/labs/types';
import { equalize, view } from './filter';

export const lab06: LabDefinition = {
  id: 6,
  slug: 'histogram',
  temario: 'пп. 10–11',
  title: { ru: 'Гистограмма и эквализация', es: 'Histograma y ecualización' },
  summary: {
    ru: 'Просмотр гистограммы и выравнивание распределения яркостей.',
    es: 'Ver el histograma y ecualizar la distribución de brillos.',
  },
  theory: {
    ru: 'Гистограмма h(k) показывает, сколько пикселей изображения имеют яркость k; по её форме сразу видно, тёмный снимок или светлый, контрастный или вялый. Эквализация использует накопленную гистограмму как функцию преобразования и растягивает занятые уровни так, чтобы распределение стало как можно более равномерным. Из-за дискретности уровней идеально плоскую гистограмму получить нельзя: уровни только сдвигаются и сливаются, но не дробятся. Метод глобальный, поэтому вместе с полезным контрастом он усиливает и шум в однородных областях.',
    es: 'El histograma h(k) cuenta cuántos píxeles tienen el nivel k, y su forma resume de un vistazo si la imagen es oscura o clara, contrastada o plana. La ecualización toma el histograma acumulado normalizado como función de transformación, de modo que los niveles muy poblados se separan y los poco poblados se juntan: el resultado aprovecha todo el rango [0, 255]. La igualdad perfecta es imposible porque los niveles son discretos y un nivel de entrada no se puede partir en dos de salida; lo que se consigue es la distribución más uniforme alcanzable. Al ser un método global, también amplifica el ruido de las zonas homogéneas y puede producir un aspecto artificial, que es justo lo que corrigen las variantes locales o con límite de contraste.',
  },
  operations: [
    {
      key: 'view',
      label: { ru: 'Показать гистограмму', es: 'Ver el histograma' },
      apply: view,
    },
    {
      key: 'equalize',
      label: { ru: 'Эквализация', es: 'Ecualizar' },
      apply: equalize,
    },
  ],
  showHistogram: true,
  implemented: false,
};
