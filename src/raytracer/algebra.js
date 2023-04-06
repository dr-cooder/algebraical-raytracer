const Alg = {
  map: (list, func) => ({
    _tag: 'Map',
    list,
    func,
  }),
  filter: (list, func) => ({
    _tag: 'Filter',
    list,
    func,
  }),
  reduce: (list, func) => ({
    _tag: 'Reduce',
    list,
    func,
  }),
  flatten: (list) => ({
    _tag: 'Flatten',
    list,
  }),
  multiply: (valueA, valueB) => ({
    _tag: 'Multiply',
    valueA,
    valueB,
  }),
  add: (valueA, valueB) => ({
    _tag: 'Add',
    valueA,
    valueB,
  }),
  reciprocal: (value) => ({
    _tag: 'Reciprocal',
    value,
  }),
  sqrtPositive: (value) => ({
    _tag: 'SqrtPositive',
    value,
  }),
  plusMinus: (value) => ({
    _tag: 'PlusMinus',
    value,
  }),
  combineXYZ: (x, y, z) => ({
    _tag: 'CombineXYZ',
    x,
    y,
    z,
  }),
  applyHitShader: (hit) => ({
    _tag: 'ApplyHitShader',
    hit,
  })
};

export {
  Alg,
};