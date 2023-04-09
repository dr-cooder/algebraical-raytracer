import { Alg } from './algebra.js';
import { pipe } from './utility/index.js';

const API = {
  // Straight from algebra, simply destructure
  ...Alg,
  // Combinations: single-variable
  negative: (value) => API.multiply(value, -1),
  multiplyMany: (...values) => API.reduce(values, API.multiply),
  addMany: (...values) => API.reduce(values, API.add),
  square: (value) => API.multiply(value, value),
  sqrts: (value) => API.plusMinus(API.sqrtPositive(value)),
  divide: (numerator, denominator) => API.multiply(numerator, API.reciprocal(denominator)),
  subtract: (valueA, valueB) => API.add(valueA, API.negative(valueB)),
  max: (valueA, valueB) => API.negative(API.min(API.negative(valueA), API.negative(valueB))),
  clampAboveZero: (value) => API.max(value, 0),
  clampZeroOne: (value) => pipe(API.min, API.clampAboveZero)(value, 1),
  round: (value) => pipe(API.add, API.floor)(value, 0.5),
  degToRad: (value) => API.multiply(value, Math.PI / 180),
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
  scale: (vector, scale) => API.map(vector, entry => API.multiply(entry, scale)),
  vectorAdd: (vectorA, vectorB) => API.entryWiseCombine(vectorA, vectorB, API.add),
  vectorMultiply: (vectorA, vectorB) => API.entryWiseCombine(vectorA, vectorB, API.multiply),
  dotProduct: (vectorA, vectorB) => API.reduce(API.vectorMultiply(vectorA, vectorB), API.add),
  rayParametric: (point, vector, t) => API.vectorAdd(point, API.scale(vector, t)),
  vectorSubtract: (vectorA, vectorB) => API.vectorAdd(vectorA, API.scale(vectorB, -1)),
  lengthNoSqrt: (vector) => API.dotProduct(vector, vector),
  length: (vector) => API.sqrtPositive(API.lengthNoSqrt(vector)),
  normalize: (vector) => API.scale(vector, API.reciprocal(API.length(vector))),
  project: (toProject, onto) => API.scale(onto, API.divide(API.dotProduct(toProject, onto), API.lengthNoSqrt(onto))),
  reflect: (incoming, normal) => API.vectorAdd(incoming, API.scale(API.project(incoming, normal), -2)),
  rotateX: (vector, theta) =>
    API.rearrangeList(
      API.rotateZ(
        API.rearrangeList(
          vector,
          [1, 2, 0],
        ),
        theta),
      [2, 0, 1],
    ),
  rotateY: (vector, theta) =>
    API.rearrangeList(
      API.rotateZ(
        API.rearrangeList(
          vector,
          [2, 0, 1],
        ),
        theta),
      [1, 2, 0],
    ),
  applyTransformMatrix: (vector, matrix) => API.reduce(
    API.entryWiseCombine(
      vector,
      matrix,
      (component, axis) => API.scale(axis, component),
    ),
    API.vectorAdd,
  ),
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
  // Combinations: strings
  joinManyStrings: (...strings) => API.reduce(strings, API.joinStrings),
  // Combinations: colors (for simplicity's sake these are stored just like vectors; more or less a similar idea)
  combineRGB: (r, g, b) => API.combineXYZ(r, g, b),
  rgbComponentToString: (component) => pipe(API.multiply, API.floor)(API.clampZeroOne(component), 255),
  colorToString: (color) => API.join([
    'rgba(',
    API.join(API.map(color, API.rgbComponentToString), ','),
    ',1.0)',
  ], ''),
  colorAdd: (colorA, colorB) => API.vectorAdd(colorA, colorB),
  colorBrightness: (color, brightness) => API.scale(color, brightness),
  colorMultiply: (colorA, colorB) => API.vectorMultiply(colorA, colorB),
  // Combinations: shaders
  sunLight: (sunVector, sunColor) => (shaderParams) => API.colorBrightness(sunColor, pipe(API.dotProduct, API.negative, API.clampAboveZero)(shaderParams.normal, sunVector)),
  ambientLight: (color) => () => color,
  multiplyShaders: (shaderA, shaderB) => API.combineShaders(shaderA, shaderB, API.colorMultiply),
  addShaders: (shaderA, shaderB) => API.combineShaders(shaderA, shaderB, API.colorAdd),
  multiplyManyShaders: (...shaders) => API.reduce(shaders, API.multiplyShaders),
  addManyShaders: (...shaders) => API.reduce(shaders, API.addShaders),
  // Combinations: rendering!
  castRay: (point, vector, geometries, skyShader) =>
    API.nullishCoalescing(
      API.reduce(
        API.filter(
          API.flatten(
            API.map(
              geometries,
              geometry => geometry(point, vector),
            ),
          ),
          hit => hit.t > 0,
        ),
        (hitA, hitB) => hitA.t <= hitB.t ? hitA : hitB,
      ),
      {
        shaderParams: {
          incoming: vector,
        },
        shader: skyShader,
      },
    ),
  rayColor: (point, vector, geometries, skyShader) => pipe(API.castRay, API.applyHitShader)(point, vector, geometries, skyShader),
};

export {
  API as Rt
}
