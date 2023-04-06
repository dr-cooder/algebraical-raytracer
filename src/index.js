import { Rt } from './raytracer/model.js';
import { calculate } from './raytracer/interpreter/calculate.js';

const width = 640, height = 480;
const canvas = document.querySelector('#canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas?.getContext('2d');

const scene = [
  Rt.sphere(
    {
      x: 0,
      y: 0,
      z: 0,
    },
    1,
    Rt.simpleDPShader,
  ),
];
const pixel = Rt.rayColor(
  {
    x: 0,
    y: -3,
    z: 0,
  },
  Rt.normalize({
    x: 1,
    y: 1,
    z: 1,
  }),
  scene,
);
console.log(calculate(pixel));
