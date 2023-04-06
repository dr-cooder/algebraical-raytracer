import { pipe, match, mapObject } from '../utility/index.js';

const matchFunctions = {
  Map: ({ list, func }) => calculate(list).map(calculate).map(calculate(func)),
  Filter: ({ list, func }) => calculate(list).map(calculate).filter(calculate(func)),
  Reduce: ({ list, func }) => {
    const calculatedList = calculate(list);
    return calculatedList.length !== 0 ? calculate(calculatedList.map(calculate).reduce(calculate(func))) : null;
  },
  Flatten: ({ list }) => calculate(list).map(calculate).flat(1),
  Multiply: ({ valueA, valueB }) => calculate(valueA) * calculate(valueB),
  Add: ({ valueA, valueB }) => calculate(valueA) + calculate(valueB),
  Reciprocal: ({ value }) => 1 / calculate(value),
  SqrtPositive: ({ value }) => Math.sqrt(calculate(value)),
  PlusMinus: ({ value }) => {
    const calculated = calculate(value);
    if (isNaN(calculated)) return [];
    return [-calculated, calculated];
  },
  CombineXYZ: ({ x, y, z }) => ({ x: calculate(x), y: calculate(y), z: calculate(z) }),
  ApplyHitShader: ({ hit }) => {
    const hitCalculated = calculate(hit);
    if ( hitCalculated === null) return null;
    const shaderParamsCalculated = mapObject(hitCalculated.shaderParams, calculate);
    const shaderCalculated = calculate(hitCalculated.shader);
    const colorFunc = shaderCalculated(shaderParamsCalculated);
    return calculate(colorFunc);
  },
};

const calculate = match(matchFunctions);

export { calculate }
