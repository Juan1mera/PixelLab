import type { LabDefinition } from '@/labs/types';
import { gradient } from './filter';

export const lab03: LabDefinition = {
  id: 3,
  slug: 'gradients',
  temario: 'пп. 7–9',
  title: {
    ru: 'Повышение резкости с помощью градиента',
    es: 'Realce de nitidez con el gradiente',
  },
  summary: {
    ru: 'g = f + k·|∇f|, где |∇f| ≈ |Gx| + |Gy| (простейший оператор, Робертс, Собел).',
    es: 'g = f + k·|∇f|, con |∇f| ≈ |Gx| + |Gy| (operador simple, Roberts, Sobel).',
  },
  theory: {
    ru: 'В обработке изображений первые производные реализуются через модуль градиента: для функции f(x, y) градиент — вектор (Gx, Gy), а его модуль |∇f| = √(Gx² + Gy²). Чтобы не вычислять корень в каждой точке, модуль приближают суммой модулей компонент: ∇f ≈ |Gx| + |Gy|. Это проще, сохраняет относительные изменения яркости, но теряет изотропность, поэтому используются маски, дающие результат для углов, кратных 90°. В окрестности 3×3 центральная точка f(x, y) обозначается z5, точка f(x − 1, y − 1) — z1 и т. д. Простейшее приближение: Gx = z8 − z5, Gy = z6 − z5. Перекрёстные градиенты Робертса: ∇f = |z9 − z5| + |z8 − z6| (маски 2×2). Оператор Собела (маски 3×3): ∇f = |(z7 + 2z8 + z9) − (z1 + 2z2 + z3)| + |(z3 + 2z6 + z9) − (z1 + 2z4 + z7)|; веса 2 у центральных точек дают большую гладкость. Сумма коэффициентов каждой маски равна 0, поэтому на участках постоянной яркости отклик равен 0, и выделяются только границы (режим «Выделение границ»). Для повышения резкости модуль градиента с весом k прибавляется к исходному снимку: g = f + k·|∇f|; контуры костей становятся светлее и чётче, контраст снимка возрастает.',
    es: 'Las primeras derivadas se implementan con el módulo del gradiente: para f(x, y) el gradiente es el vector (Gx, Gy) y su módulo |∇f| = √(Gx² + Gy²). Para no calcular una raíz por píxel se aproxima con la suma de módulos: ∇f ≈ |Gx| + |Gy|. Es más barato y conserva los cambios relativos de brillo, pero pierde la isotropía, así que solo se usan máscaras que responden a ángulos múltiplos de 90°. En la vecindad 3×3 el píxel central f(x, y) es z5, f(x − 1, y − 1) es z1, etc. La aproximación más simple es Gx = z8 − z5, Gy = z6 − z5. Los gradientes cruzados de Roberts dan ∇f = |z9 − z5| + |z8 − z6| (máscaras 2×2). El operador de Sobel (3×3) da ∇f = |(z7 + 2z8 + z9) − (z1 + 2z2 + z3)| + |(z3 + 2z6 + z9) − (z1 + 2z4 + z7)|; el peso 2 de los puntos centrales suaviza el resultado. Los coeficientes de cada máscara suman 0, así que en zonas de brillo constante la respuesta es 0 y solo quedan los contornos (modo «Выделение границ»). Para realzar la nitidez se suma al original el módulo del gradiente con un peso k: g = f + k·|∇f|; los bordes de los huesos se aclaran y el contraste de la radiografía aumenta.',
  },
  operations: [
    {
      key: 'gradient',
      label: { ru: 'Градиент', es: 'Gradiente' },
      menuGroup: { ru: 'Повышение резкости', es: 'Realce de nitidez' },
      params: [
        {
          key: 'operator',
          label: { ru: 'Оператор', es: 'Operador' },
          type: 'select',
          options: [
            { value: 'sobel', label: { ru: 'Собел (3×3)', es: 'Sobel (3×3)' } },
            { value: 'roberts', label: { ru: 'Робертс (2×2)', es: 'Roberts (2×2)' } },
            {
              value: 'simple',
              label: { ru: 'Простейший (z8 − z5, z6 − z5)', es: 'Simple (z8 − z5, z6 − z5)' },
            },
          ],
          default: 'sobel',
        },
        {
          key: 'output',
          label: { ru: 'Результат', es: 'Salida' },
          type: 'select',
          options: [
            {
              value: 'sharpen',
              label: { ru: 'Повышение резкости: f + k·|∇f|', es: 'Realce: f + k·|∇f|' },
            },
            {
              value: 'edges',
              label: { ru: 'Выделение границ: |∇f|', es: 'Contornos: |∇f|' },
            },
          ],
          default: 'sharpen',
        },
        {
          key: 'k',
          label: { ru: 'Вес градиента k', es: 'Peso del gradiente k' },
          type: 'slider',
          min: 0,
          max: 2,
          step: 0.05,
          // Elegido a ojo con Sobel sobre la radiografía de la mano (variante 1).
          default: 0.25,
          hint: {
            ru: 'Только для повышения резкости. Отклик Собела примерно в 4 раза больше, чем у Робертса, поэтому для Робертса и простейшего оператора берите k ≈ 1.',
            es: 'Solo para el realce. La respuesta de Sobel es unas 4 veces la de Roberts: con Roberts o el operador simple usa k ≈ 1.',
          },
        },
        {
          key: 'normalize',
          label: { ru: 'Нормировать границы', es: 'Normalizar los contornos' },
          type: 'checkbox',
          default: true,
          hint: {
            ru: 'Только для выделения границ: растянуть максимум |∇f| до 255.',
            es: 'Solo para contornos: escalar el máximo de |∇f| hasta 255.',
          },
        },
      ],
      apply: gradient,
    },
  ],
  implemented: true,
};
