import type { LabDefinition, LabParam } from '@/labs/types';
import { mean, median } from './filter';

const size: LabParam = {
  key: 'size',
  label: { ru: 'Размер окна', es: 'Tamaño de la ventana' },
  type: 'select',
  options: [
    { value: '3', label: { ru: '3×3', es: '3×3' } },
    { value: '5', label: { ru: '5×5', es: '5×5' } },
    { value: '7', label: { ru: '7×7', es: '7×7' } },
    { value: '9', label: { ru: '9×9', es: '9×9' } },
  ],
  default: '3',
  hint: {
    ru: 'Чем больше окно, тем сильнее сглаживание.',
    es: 'Cuanto mayor la ventana, más fuerte el suavizado.',
  },
};

export const lab04: LabDefinition = {
  id: 4,
  slug: 'smoothing',
  temario: 'пп. 5–6',
  title: { ru: 'Сглаживающие фильтры', es: 'Filtros de suavizado' },
  summary: {
    ru: 'Среднее арифметическое и медиана в окне n×n.',
    es: 'Media aritmética y mediana en una ventana n×n.',
  },
  theory: {
    ru: 'Сглаживание подавляет шум, усредняя яркость в окрестности пикселя. Линейный фильтр среднего — это свёртка с постоянной маской: он ослабляет шум пропорционально корню из числа отсчётов, но одновременно размывает границы. Медианный фильтр берёт средний элемент упорядоченного списка значений окна и потому полностью убирает импульсный шум, почти не портя границы. Оба фильтра требуют политики обработки краёв: в PixeLab она задаётся типом BorderMode.',
    es: 'El suavizado atenúa el ruido promediando el entorno de cada píxel. El filtro de media es una convolución con máscara constante 1/n²: reduce el ruido aditivo de forma proporcional a la raíz del número de muestras, pero difumina los bordes en la misma medida, y una ventana grande convierte los contornos en rampas. La mediana es un filtro de orden, no lineal: toma el elemento central de la lista ordenada de la ventana, así que un píxel de ruido impulsivo aislado no influye en el resultado y los bordes sobreviven casi intactos. A cambio la mediana cuesta más, porque hay que ordenar n² valores por píxel, y redondea las esquinas de los objetos pequeños. Ambos necesitan una política de bordes, que aquí da el tipo `BorderMode` de `at()`.',
  },
  operations: [
    {
      key: 'mean',
      label: { ru: 'Среднее', es: 'Media' },
      params: [size],
      apply: mean,
    },
    {
      key: 'median',
      label: { ru: 'Медиана', es: 'Mediana' },
      params: [size],
      apply: median,
    },
  ],
  implemented: false,
};
