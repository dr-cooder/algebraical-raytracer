import { Alg } from './algebra.js';
import { pipe } from './utility/index.js';

const API = {
  // Straight from algebra, simply destructure
  ...Alg,
  // Combinations: single-variable
  square: (value) => API.multiply(value, value),
  divide: (numerator, denominator) => API.multiply(numerator, API.reciprocal(denominator)),
  subtract: (valueA, valueB) => API.add(valueA, API.multiply(valueB, -1)),
  // Combinations: vectors
  rayParametric: (point, vector, t) => API.vectorAdd(point, API.scale(vector, t)),
  vectorSubtract: (vectorA, vectorB) => API.vectorAdd(vectorA, API.scale(vectorB, -1)),
  lengthNoSqrt: (vector) => API.dotProduct(vector, vector),
  length: (vector) => pipe(API.lengthNoSqrt(vector), Math.sqrt),
  normalize: (vector) => API.scale(vector, API.reciprocal(API.length(vector))),
  project: (toProject, onto) => API.scale(onto, API.divide(API.dotProduct(toProject, onto), API.lengthNoSqrt(onto))),
  reflect: (incoming, normal) => API.vectorAdd(incoming, API.scale(API.project(incoming, normal), -2)),
  // Combinations: geometry
  sphere: (center, radius) => {
    return ({ point, vector }) => {
      // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
      const centerToPoint = API.vectorAdd(point, center);
      return API.map(
        API.quadratic(
          API.lengthNoSqrt(vector),
          API.dotProduct(API.scale(centerToPoint, 2), vector),
          API.subtract(API.lengthNoSqrt(centerToPoint), API.square(radius)),
        ),
        t => {
          const position = API.rayParametric(point, vector, t);
          return {
            t,
            position,
            normal: API.scale(API.subtract(position, center), API.reciprocal(radius)),
            incoming: vector,
          }
        },
      );
    };
  },
};

export {
  API as Rt
}
