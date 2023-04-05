import { pipe, matchRecursive } from '../utility/index.js';

const render = matchRecursive({
  Map: ({list, func}) => list.map(func),
  Filter: ({list, func}) => list.filter(func),
  Reduce: ({list, func}) => list.length !== 0 ? list.reduce(func) : null,
  Multiply: ({valueA, valueB}) => valueA * valueB,
  Add: ({valueA, valueB}) => valueA + valueB,
  Reciprocal: ({ value }) => 1 / value,
  Quadratic: ({ a, b, c }) => {
    const sqrtBSquaredMinusFourAC = Math.sqrt(b * b - 4 * a * c);
    if (isNaN(sqrtBSquaredMinusFourAC)) {
      return null;
    } else {
      const negativeB = -b;
      const twoA = 2 * a;
      return [
        (negativeB - sqrtBSquaredMinusFourAC) / twoA,
        (negativeB + sqrtBSquaredMinusFourAC) / twoA,
      ];
    }
  },
  Scale: ({ vector, scale }) => ({
    x: vector.x * scale,
    y: vector.y * scale,
    z: vector.z * scale,
  }),
  VectorAdd: ({ vectorA, vectorB }) => ({
    x: vectorA.x + vectorB.x,
    y: vectorA.y + vectorB.y,
    z: vectorA.z + vectorB.z,
  }),
  DotProduct: ({ vectorA, vectorB }) => vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z,
});

export { render }
