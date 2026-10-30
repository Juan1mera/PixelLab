import type { LabDefinition } from '@/labs/types';
import { laplacian } from './filter';

export const lab04: LabDefinition = {
  id: 4,
  slug: 'laplacian',
  temario: 'п. 9',
  title: {
    ru: 'Повышение резкости с помощью лапласиана',
    es: 'Realce de nitidez con el laplaciano',
  },
  summary: {
    ru: '$g = f \\mp \\nabla^2 f$, знак по центральному коэффициенту $w(0,0)$ маски (рис. 1 и 2: 4 и 8 соседей).',
    es: '$g = f \\mp \\nabla^2 f$, con el signo según el coeficiente central $w(0,0)$ (máscaras de 4 y 8 vecinos).',
  },
  theory: {
    ru: String.raw`
      Простейшим изотропным оператором, основанным на производных, является лапласиан:
      $$ \nabla^2 f = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2}
      Он линеен, а его отклик не зависит от направления неоднородностей. В дискретном виде
      $$ \frac{\partial^2 f}{\partial x^2} = f(x + 1, y) + f(x - 1, y) - 2f(x, y)
      $$ \frac{\partial^2 f}{\partial y^2} = f(x, y + 1) + f(x, y - 1) - 2f(x, y)
      откуда
      $$ \begin{aligned} \nabla^2 f = {} & f(x + 1, y) + f(x - 1, y) \\ & + f(x, y + 1) + f(x, y - 1) - 4f(x, y) \end{aligned}
      Этой формуле соответствует маска рис. 1, а (центр −4), изотропная для поворотов на углы, кратные 90°. Добавив два диагональных члена, получаем маску рис. 1, б (центр −8), изотропную для углов, кратных 45°. Маски рис. 2 (центр +4 и +8) — «негативный» лапласиан: результат тот же, но с другим знаком.
      Лапласиан подчёркивает разрывы яркости и подавляет области с плавными изменениями, поэтому сам по себе даёт сероватые линии контуров на тёмном фоне (рис. 3, режим «Только лапласиан»). Чтобы восстановить фон и сохранить эффект повышения резкости, лапласиан складывают с исходным изображением. Обобщённый алгоритм:
      $$ g = \begin{cases} f - \nabla^2 f, & \text{если } w(0,0) < 0 \\ f + \nabla^2 f, & \text{если } w(0,0) \ge 0 \end{cases}
      где $w(0,0)$ — центральный коэффициент маски. Маска с 8 соседями даёт более сильное повышение резкости, чем маска с 4 соседями.
    `,
    es: String.raw`
      El operador isótropo más simple basado en derivadas es el laplaciano:
      $$ \nabla^2 f = \frac{\partial^2 f}{\partial x^2} + \frac{\partial^2 f}{\partial y^2}
      Es lineal y su respuesta no depende de la dirección de las discontinuidades. En forma discreta
      $$ \frac{\partial^2 f}{\partial x^2} = f(x + 1, y) + f(x - 1, y) - 2f(x, y)
      $$ \frac{\partial^2 f}{\partial y^2} = f(x, y + 1) + f(x, y - 1) - 2f(x, y)
      de donde
      $$ \begin{aligned} \nabla^2 f = {} & f(x + 1, y) + f(x - 1, y) \\ & + f(x, y + 1) + f(x, y - 1) - 4f(x, y) \end{aligned}
      A esta fórmula le corresponde la máscara de la fig. 1a (centro −4), isótropa para giros múltiplos de 90°. Añadiendo los dos términos diagonales se obtiene la fig. 1b (centro −8), isótropa para múltiplos de 45°. Las máscaras de la fig. 2 (centro +4 y +8) son el laplaciano «negativo»: mismo resultado con el signo cambiado.
      El laplaciano resalta los saltos de brillo y suprime las zonas de variación suave, así que por sí solo da líneas grisáceas en los contornos sobre un fondo oscuro (fig. 3, modo «Solo el laplaciano»). Para recuperar el fondo conservando el realce se suma el laplaciano a la imagen original. Algoritmo generalizado:
      $$ g = \begin{cases} f - \nabla^2 f, & \text{si } w(0,0) < 0 \\ f + \nabla^2 f, & \text{si } w(0,0) \ge 0 \end{cases}
      donde $w(0,0)$ es el coeficiente central de la máscara. La máscara de 8 vecinos realza más que la de 4.
    `,
  },
  operations: [
    {
      key: 'laplacian',
      label: { ru: 'Лапласиан', es: 'Laplaciano' },
      menuGroup: { ru: 'Повышение резкости', es: 'Realce de nitidez' },
      params: [
        {
          key: 'mask',
          label: { ru: 'Маска', es: 'Máscara' },
          type: 'select',
          options: [
            {
              value: '1a',
              label: { ru: 'Рис. 1, а: [0 1 0; 1 −4 1; 0 1 0]', es: 'Fig. 1a: [0 1 0; 1 −4 1; 0 1 0]' },
            },
            {
              value: '1b',
              label: { ru: 'Рис. 1, б: [1 1 1; 1 −8 1; 1 1 1]', es: 'Fig. 1b: [1 1 1; 1 −8 1; 1 1 1]' },
            },
            {
              value: '2a',
              label: {
                ru: 'Рис. 2, а: [0 −1 0; −1 4 −1; 0 −1 0]',
                es: 'Fig. 2a: [0 −1 0; −1 4 −1; 0 −1 0]',
              },
            },
            {
              value: '2b',
              label: {
                ru: 'Рис. 2, б: [−1 −1 −1; −1 8 −1; −1 −1 −1]',
                es: 'Fig. 2b: [−1 −1 −1; −1 8 −1; −1 −1 −1]',
              },
            },
          ],
          default: '1a',
          hint: {
            ru: 'а — изотропна для углов, кратных 90°; б — для углов, кратных 45°.',
            es: 'a: isótropa para múltiplos de 90°; b: para múltiplos de 45°.',
          },
        },
        {
          key: 'output',
          label: { ru: 'Результат', es: 'Salida' },
          type: 'select',
          options: [
            {
              value: 'sharpen',
              label: { ru: 'Повышение резкости: f ∓ ∇²f', es: 'Realce: f ∓ ∇²f' },
            },
            {
              value: 'laplacian',
              label: { ru: 'Только лапласиан: ∇²f (рис. 3)', es: 'Solo el laplaciano: ∇²f (fig. 3)' },
            },
          ],
          default: 'sharpen',
        },
        {
          key: 'k',
          label: { ru: 'Вес лапласиана k', es: 'Peso del laplaciano k' },
          type: 'slider',
          min: 0,
          max: 2,
          step: 0.05,
          default: 1,
          hint: {
            ru: 'Только для повышения резкости: $g = f \\mp k \\cdot \\nabla^2 f$. $k = 1$ — обобщённый алгоритм из методички.',
            es: 'Solo para el realce: $g = f \\mp k \\cdot \\nabla^2 f$. $k = 1$ es el algoritmo generalizado del enunciado.',
          },
        },
        {
          key: 'normalize',
          label: { ru: 'Нормировать лапласиан', es: 'Normalizar el laplaciano' },
          type: 'checkbox',
          default: false,
          hint: {
            ru: 'Только для режима «Только лапласиан»: растянуть $[\\min, \\max]$ значений $\\nabla^2 f$ до $[0,\\, 255]$ вместо отсечения отрицательных значений.',
            es: 'Solo para «Solo el laplaciano»: escalar $[\\min, \\max]$ de $\\nabla^2 f$ a $[0,\\, 255]$ en vez de recortar los negativos.',
          },
        },
      ],
      apply: laplacian,
    },
  ],
  implemented: true,
};
