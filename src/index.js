import { Rt } from './raytracer/model.js';
import { calculate } from './raytracer/interpreter/calculate.js';
import { renderToCanvas } from './raytracer/interpreter/renderToCanvas.js';

// const width = 384, height = 288;
const width = 192, height = 144;
// const width = 16, height = 12;
const canvas = document.querySelector('#canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas?.getContext('2d');

const myLights = calculate(Rt.addManyShaders(
  Rt.ambientLight(Rt.combineRGB(
    0.1,
    0.15,
    0.2,
  )),
  Rt.sunLight(
    Rt.normalize(Rt.combineXYZ(
      1,
      1,
      -1
    )),
    Rt.combineRGB(
      1,
      1,
      1,
    ),
  ),
));
console.log(myLights);


const myObjects = [
  Rt.sphere(
    Rt.combineXYZ(0, 0, 1,),
    1,
    calculate(Rt.multiplyShaders(
      myLights,
      () => Rt.combineRGB(0.271, 0.345, 0.094,),
    )),
  ),
  Rt.sphere(
    Rt.combineXYZ(0, -0.11, 1,),
    0.9,
    calculate(Rt.multiplyShaders(
      myLights,
      () => Rt.combineRGB(0.9, 0, 0,),
    )),
  ),
  Rt.groundPlane(
    0,
    calculate(Rt.multiplyShaders(
      myLights,
      Rt.checker(
        1,
        Rt.combineRGB(0.1, 0.1, 0.1),
        Rt.combineRGB(1.0, 1.0, 1.0),
      ),
    )),
  ),
].map(calculate);

const mySkyColor = calculate(Rt.combineRGB(
  0.5,
  0.75,
  1,
));

renderToCanvas({
  ctx,
  width,
  height,
  cameraPosition: Rt.combineXYZ(7.35889, -6.92579, 5.95831),
  cameraPitch: 63.5593,
  cameraYaw: 46.6919,
  cameraFOV: 39.5978,
  objects: myObjects,
  skyShader: () => mySkyColor,
});
