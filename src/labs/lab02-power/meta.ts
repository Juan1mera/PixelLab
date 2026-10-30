import type { LabDefinition } from '@/labs/types';
import { power } from './filter';

export const lab02: LabDefinition = {
  id: 2,
  slug: 'power',
  temario: 'п. 3',
  title: { ru: 'Степенное преобразование', es: 'Transformación de potencia' },
  summary: {
    ru: 'Гамма-коррекция $s = c \\cdot r^{\\gamma}$ с масштабированием в $[0,\\, L - 1]$.',
    es: 'Corrección gamma $s = c \\cdot r^{\\gamma}$ escalada a $[0,\\, L - 1]$.',
  },
  theory: {
    ru: String.raw`
      Гамма-коррекция (степенное преобразование) используется для управления контрастом изображения и задаётся функцией
      $$ s = c \cdot r^{\gamma}
      где $r$ — яркость исходного изображения, $s$ — яркость преобразованного, $c$ и $\gamma$ — положительные константы.
      При $\gamma < 1$ узкий диапазон малых входных яркостей преобразуется в широкий диапазон выходных (изображение светлеет); при $\gamma = 1$ изменений нет; при $\gamma > 1$ широкий диапазон входных яркостей преобразуется в узкий диапазон выходных (изображение темнеет, растягиваются светлые участки).
      Значения выходного изображения масштабируются до диапазона исходного $[0,\, L - 1]$. Для этого
      $$ c = (L - 1)^{1 - \gamma}
      то есть
      $$ s = (L - 1) \cdot \left( \frac{r}{L - 1} \right)^{\gamma}
      Здесь $L - 1$ — наибольшая яркость исходного снимка (255 для 8-битного изображения). Так как преобразование поточечное, оно вычисляется через таблицу из 256 значений. Для рентгенограммы кисти руки $\gamma \approx 2$ затемняет мягкие ткани и повышает контраст костных структур.
    `,
    es: String.raw`
      La corrección gamma (transformación de potencia) sirve para controlar el contraste y responde a
      $$ s = c \cdot r^{\gamma}
      donde $r$ es el brillo de entrada, $s$ el de salida y $c$, $\gamma$ constantes positivas.
      Con $\gamma < 1$ un rango estrecho de brillos bajos se expande a un rango amplio de salida (la imagen se aclara); con $\gamma = 1$ no cambia nada; con $\gamma > 1$ un rango amplio de entrada se comprime a uno estrecho (la imagen se oscurece y se expanden las luces).
      El enunciado exige escalar la salida al rango de la entrada $[0,\, L - 1]$, por eso $c$ no es libre, sino
      $$ c = (L - 1)^{1 - \gamma}
      y la fórmula queda
      $$ s = (L - 1) \cdot \left( \frac{r}{L - 1} \right)^{\gamma}
      $L - 1$ es el brillo máximo del original (255 en una imagen de 8 bits con algún píxel blanco). Como la transformación es punto a punto, se precalcula una tabla de 256 entradas en vez de llamar a Math.pow por píxel. Para la radiografía de la mano (variante 1), $\gamma \approx 2$ oscurece el tejido blando y realza el contraste de los huesos.
    `,
  },
  operations: [
    {
      key: 'power',
      label: { ru: 'Степенное преобразование', es: 'Transformación de potencia' },
      params: [
        {
          key: 'gamma',
          label: { ru: 'Показатель степени γ', es: 'Exponente γ' },
          type: 'slider',
          min: 0.01,
          max: 5,
          step: 0.01,
          // Elegido a ojo sobre la radiografía de la mano (variante 1).
          default: 2,
          hint: {
            ru: '$\\gamma < 1$ осветляет, $\\gamma = 1$ — без изменений, $\\gamma > 1$ затемняет и повышает контраст светлых участков. Коэффициент $c = (L - 1)^{1 - \\gamma}$ рассчитывается автоматически.',
            es: '$\\gamma < 1$ aclara, $\\gamma = 1$ no cambia nada, $\\gamma > 1$ oscurece y realza el contraste de las luces. El coeficiente $c = (L - 1)^{1 - \\gamma}$ se calcula solo.',
          },
        },
      ],
      apply: power,
    },
  ],
  implemented: true,
};
