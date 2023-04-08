import { Rt } from './raytracer/model.js';
import { pipe } from './raytracer/utility/index.js';
import { calculate } from './raytracer/interpreter/calculate.js';

const width = 192, height = 144; // 192x144
const canvas = document.querySelector('#canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas?.getContext('2d');

const myShader = calculate(Rt.sunShader(Rt.normalize(Rt.combineXYZ(
  1,
  -1,
  -1
))));

const scene = [
  calculate(Rt.sphere(
    Rt.combineXYZ(0, 0, -6,),
    1,
    myShader,
  )),
];

const skyColor = calculate(Rt.combineRGB(
  0.5,
  0.75,
  1,
));

// Camera behavior

const fov = 40;
const halfFovTan = Math.tan(calculate(Rt.degToRad(fov)) / 2);
const greaterDimension = Math.max(width, height);

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, width, height);

const startTime = Date.now();
const totalPixels = width * height;
let pixelsDone = 0;
const pixelDone = () => {
  pixelsDone++;
  if (pixelsDone == totalPixels) console.log(`Calculated ${width}x${height} pixels in ${(Date.now() - startTime) / 1000} seconds`);
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    setTimeout(() => {
      const pixel = calculate(
        pipe(Rt.rayColor, Rt.colorToString)(
          calculate(
            Rt.combineXYZ(
              0,
              0,
              0,
            ),
          ),
          calculate(
            Rt.normalize(
              Rt.combineXYZ(
                halfFovTan * ((x + 0.5) / width - 0.5) * 2 * (width / greaterDimension),
                halfFovTan * ((y + 0.5) / height - 0.5) * -2 * (height / greaterDimension),
                -1,
              ),
            ),
          ),
          scene,
          () => skyColor,
        ),
      );
      // console.log(pixel); // calculate(Rt.colorToString(pixel)))
      ctx.fillStyle = pixel;
      ctx.fillRect(x, y, 1, 1);
      pixelDone();
    });
  }
}
