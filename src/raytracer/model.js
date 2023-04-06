import { Alg } from './algebra.js';
import { pipe } from './utility/index.js';

const API = {
  // Straight from algebra, simply destructure
  ...Alg,
  // Combinations: single-variable
  multiplyMany: (...values) => API.reduce(values, API.multiply),
  addMany: (...values) => API.reduce(values, API.add),
  square: (value) => API.multiply(value, value),
  sqrts: (value) => API.plusMinus(API.sqrtPositive(value)),
  divide: (numerator, denominator) => API.multiply(numerator, API.reciprocal(denominator)),
  subtract: (valueA, valueB) => API.add(valueA, API.multiply(valueB, -1)),
  // Combinations: complex single-variable formulas
  quadratic: (a, b, c) => API.map(
    API.sqrts(
      API.subtract(
        API.square(b),
        API.multiplyMany(4, a, c),
      ),
    ),
    sqrt => API.divide(
      API.subtract(sqrt, b),
      API.multiply(2, a),
    ),
  ),
  // Combinations: vectors
  scale: (vector, scale) => API.combineXYZ(
    API.multiply(vector.x, scale),
    API.multiply(vector.y, scale),
    API.multiply(vector.z, scale),
  ),
  vectorAdd: (vectorA, vectorB) => API.combineXYZ(
    API.add(vectorA.x, vectorB.x),
    API.add(vectorA.y, vectorB.y),
    API.add(vectorA.z, vectorB.z),
  ),
  dotProduct: (vectorA, vectorB) => API.addMany(
    API.multiply(vectorA.x, vectorB.x),
    API.multiply(vectorA.y, vectorB.y),
    API.multiply(vectorA.z, vectorB.z),
  ),
  rayParametric: (point, vector, t) => API.vectorAdd(point, API.scale(vector, t)),
  vectorSubtract: (vectorA, vectorB) => API.vectorAdd(vectorA, API.scale(vectorB, -1)),
  lengthNoSqrt: (vector) => API.dotProduct(vector, vector),
  length: (vector) => API.sqrtPositive(API.lengthNoSqrt(vector)),
  normalize: (vector) => API.scale(vector, API.reciprocal(API.length(vector))),
  project: (toProject, onto) => API.scale(onto, API.divide(API.dotProduct(toProject, onto), API.lengthNoSqrt(onto))),
  reflect: (incoming, normal) => API.vectorAdd(incoming, API.scale(API.project(incoming, normal), -2)),
  // Combinations: geometry
  sphere: (center, radius, shader) => (point, vector) => {
    // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
    const centerToPoint = API.vectorSubtract(point, center);
    return API.map(
      API.quadratic(
        API.lengthNoSqrt(vector),
        API.dotProduct(API.scale(centerToPoint, 2), vector),
        API.subtract(API.lengthNoSqrt(centerToPoint), API.square(radius)),
      ),
      (t) => {
        const position = API.rayParametric(point, vector, t);
        return {
          t,
          shaderParams: {
            position,
            normal: API.scale(API.vectorSubtract(position, center), API.reciprocal(radius)),
            incoming: vector,
          },
          shader,
        };
      },
    );
  },
  // Combinations: raytracing
  castRay: (point, vector, geometries) => API.reduce(
    API.filter(
      API.flatten(
        API.map(
          geometries,
          geometry => geometry(point, vector),
        ),
      ),
      hit => hit.t > 0
    ),
    (hitA, hitB) => hitA.t <= hitB.t ? hitA : hitB,
  ),
  rayColor: (point, vector, geometries) => pipe(API.castRay, API.applyHitShader)(point, vector, geometries),
  // Combinations: shaders
  simpleDPShader: (shaderParams) => API.dotProduct(API.scale(shaderParams.incoming, -1), shaderParams.normal)
};

export {
  API as Rt
}
