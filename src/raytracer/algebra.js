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
  quadratic: (a, b, c) => ({
    _tag: 'Quadratic',
    a,
    b,
    c,
  }),
  scale: (vector, scale) => ({
    _tag: 'Scale',
    vector,
    scale,
  }),
  vectorAdd: (vectorA, vectorB) => ({
    _tag: 'VectorAdd',
    vectorA,
    vectorB,
  }),
  dotProduct: (vectorA, vectorB) => ({
    _tag: 'DotProduct',
    vectorA,
    vectorB,
  }),
};

export {
  Alg,
};