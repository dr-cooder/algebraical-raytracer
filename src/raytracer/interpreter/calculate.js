import { pipe, match, mapObject } from '../utility/index.js';

const matchFunctions = {
  Map: ({ list, func }) => calculate(list).map(calculate).map(calculate(func)),
  Filter: ({ list, func }) => calculate(list).map(calculate).filter(calculate(func)),
  Reduce: ({ list, func }) => {
    const calculatedList = calculate(list);
    return calculatedList.length !== 0 ? calculate(calculatedList.map(calculate).reduce(calculate(func))) : null;
  },
  Flatten: ({ list }) => calculate(list).map(calculate).flat(1),
  NullishCoalescing: ({ preferred, fallback }) => calculate(preferred) ?? calculate(fallback),
  Multiply: ({ valueA, valueB }) => calculate(valueA) * calculate(valueB),
  Add: ({ valueA, valueB }) => calculate(valueA) + calculate(valueB),
  Reciprocal: ({ value }) => 1 / calculate(value),
  SqrtPositive: ({ value }) => Math.sqrt(calculate(value)),
  PlusMinus: ({ value }) => {
    const calculated = calculate(value);
    if (isNaN(calculated)) return [];
    return [-calculated, calculated];
  },
  Min: ({ valueA, valueB }) => Math.min(calculate(valueA), calculate(valueB)),
  Floor: ({ value }) => Math.floor(calculate(value)),
  CombineXYZ: ({ x, y, z }) => ({ x: calculate(x), y: calculate(y), z: calculate(z) }),
  ApplyHitShader: ({ hit }) => {
    const hitCalculated = calculate(hit);
    if ( hitCalculated === null) return null;
    return calculate(calculate(hitCalculated.shader)(mapObject(hitCalculated.shaderParams, calculate)));
  },
  JoinStrings: ({ stringA, stringB }) => `${calculate(stringA)}${calculate(stringB)}`
};

const calculate = match(matchFunctions);

export { calculate }
