import type { LabDefinition } from '@/labs/types';
import { power } from './filter';

export const lab02: LabDefinition = {
  id: 2,
  slug: 'power',
  temario: 'п. 3',
  title: { ru: 'Степенное преобразование', es: 'Transformación de potencia' },
  summary: {
    ru: 'Гамма-коррекция s = c · r^γ.',
    es: 'Corrección gamma s = c · r^γ.',
  },
  theory: {
    ru: 'Степенное преобразование задаётся формулой s = c · r^γ, где r — яркость, приведённая к отрезку [0, 1]. Показатель γ управляет формой кривой: при γ < 1 тени растягиваются и изображение светлеет, при γ > 1 растягиваются света и изображение темнеет. Коэффициент c задаёт общее усиление. Так как преобразование поточечное, его удобно считать через таблицу из 256 значений.',
    es: 'La transformación de potencia responde a s = c · r^γ, donde r es el brillo normalizado al intervalo [0, 1]. El exponente γ decide la forma de la curva: con γ < 1 se expanden las sombras y la imagen se aclara, con γ > 1 se expanden las luces y la imagen se oscurece, y con γ = 1 queda una simple ganancia lineal c. Es la corrección gamma de toda la vida, la que compensa la respuesta no lineal de los monitores. Como es punto a punto y solo hay 256 entradas posibles, conviene precalcular una tabla de consulta en vez de llamar a `Math.pow` una vez por píxel. Ojo con saturar: valores de c altos llevan buena parte del histograma a 255 y esa información ya no se recupera.',
  },
  operations: [
    {
      key: 'power',
      label: { ru: 'Степень', es: 'Potencia' },
      params: [
        {
          key: 'c',
          label: { ru: 'Коэффициент c', es: 'Coeficiente c' },
          type: 'slider',
          min: 0.1,
          max: 3,
          step: 0.1,
          default: 1,
          hint: { ru: 'Общее усиление яркости.', es: 'Ganancia global del brillo.' },
        },
        {
          key: 'gamma',
          label: { ru: 'Гамма γ', es: 'Gamma γ' },
          type: 'slider',
          min: 0.1,
          max: 5,
          step: 0.1,
          default: 1,
          hint: {
            ru: 'γ < 1 осветляет тени, γ > 1 затемняет.',
            es: 'γ < 1 aclara las sombras, γ > 1 oscurece.',
          },
        },
      ],
      apply: power,
    },
  ],
  implemented: false,
};
