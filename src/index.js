import { Rt } from './raytracer/model.js';
import { render } from './raytracer/interpreter/render.js';

const width = 640, height = 480;
const canvas = document.querySelector('#canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas?.getContext('2d');

const scene = Rt.sphere({x: 0, y: 0, z: 0}, 1);
const hits = scene({
  point: {
    x: 0,
    y: -3,
    z: 0,
  },
  vector: {
    x: 0,
    y: 1,
    z: 0,
  },
});
console.log(hits);
console.log(render(hits));
