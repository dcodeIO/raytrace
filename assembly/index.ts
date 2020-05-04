// https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-ray-tracing/

import { Vec3 } from "./vec3";
import { Sphere } from "./shapes";
export { Vec3, Sphere };

const MAX_RAY_DEPTH = 5;

function raytrace(origin: Vec3, direction: Vec3, spheres: Sphere[], depth: i32): Vec3 {

  var tNearest: f32 = Infinity;
  var sphere: Sphere | null = null;
  for (let i = 0, k = spheres.length; i < k; ++i) {
    Sphere.tNear = Infinity;
    Sphere.tFar = Infinity;
    if (spheres[i].intersect(origin, direction)) {
      if (Sphere.tNear < 0) Sphere.tNear = Sphere.tFar;
      if (Sphere.tNear < tNearest) {
        tNearest = Sphere.tNear;
        sphere = spheres[i];
      }
    }
  }

  if (!sphere) return new Vec3(2, 2, 2);

  var surfaceColor = new Vec3(0, 0, 0);
  var hitPoint = origin.add(direction.smul(tNearest));
  var hitNormal = hitPoint.sub(sphere.center);
  hitNormal.normalize();

  var bias: f32 = 1e-4;

  var inside = direction.dot(hitNormal) > 0;
  if (inside) hitNormal = hitNormal.neg();

  var transparency = sphere.transparency;
  var reflection = sphere.reflection;
  if ((transparency > 0 || reflection > 0) && depth < MAX_RAY_DEPTH) {
    let facingRatio = direction.neg().dot(hitNormal);
    let fresnelEffect = mix((1.0 - facingRatio) ** 3, 1.0, 0.1);
    let reflectionDirection = direction.sub(hitNormal.smul(2 * direction.dot(hitNormal)));
    reflectionDirection.normalize();
    let reflection = raytrace(hitPoint.add(hitNormal.smul(bias)), reflectionDirection, spheres, depth + 1);
    let refraction = new Vec3(0, 0, 0);
    if (transparency) {
      let ior: f32 = 1.1;
      let eta: f32 = inside ? ior : 1.0 / ior;
      let cosi = hitNormal.neg().dot(direction);
      let k: f32 = 1.0 - eta * eta * (1.0 - cosi * cosi);
      let refractionDirection = direction.smul(eta).add(hitNormal.smul(eta * cosi - sqrt(k)));
      refractionDirection.normalize();
      refraction = raytrace(hitPoint.sub(hitNormal.smul(bias)), refractionDirection, spheres, depth + 1);
    }
    surfaceColor = reflection.smul(fresnelEffect).add(refraction.smul(1 - fresnelEffect).smul(transparency)).mul(sphere.surfaceColor);
  } else {
    for (let i = 0, k = spheres.length; i < k; ++i) {
      if (spheres[i].emissionColor.x > 0) {
        let transmission = new Vec3(1, 1, 1);
        let lightDirection = spheres[i].center.sub(hitPoint);
        lightDirection.normalize();
        for (let j = 0; j < k; ++j) {
          if (i != j) {
            if (spheres[j].intersect(hitPoint.add(hitNormal.smul(bias)), lightDirection)) {
              transmission = new Vec3(0, 0, 0);
              break;
            }
          }
        }
        surfaceColor = surfaceColor.add(
          sphere.surfaceColor
            .mul(transmission)
            .smul(max<f32>(0, hitNormal.dot(lightDirection)))
            .mul(spheres[i].emissionColor)
        );
      }
    }
  }
  return surfaceColor.add(sphere.emissionColor);
}

function mix(a: f32, b: f32, ratio: f32): f32 {
  return b * ratio + a * (1 - ratio);
}

var width: i32 = 640;
var height: i32 = 480;
var aspect: f32;
var fov: f32 = 30;
var buffer: ArrayBuffer;

export function resize(w: i32, h: i32): ArrayBuffer {
  width = w; height = h; aspect = <f32>w / <f32>h;
  buffer = new ArrayBuffer(w * h * sizeof<i32>());
  return buffer;
}

export function render(x: i32, spheres: Sphere[]): void {
  var invWidth: f32  = 1.0 / <f32>width,
      invHeight: f32 = 1.0 / <f32>height;
  var angle = Mathf.tan(Mathf.PI * 0.5 * fov / 180);
  for (let y = 0; y < height; ++y) {
    let xx: f32 = (2.0 * ((<f32>x + 0.5) * invWidth) - 1) * angle * aspect;
    let yy: f32 = (1.0 - 2.0 * ((<f32>y + 0.5) * invHeight)) * angle;
    let raydir = new Vec3(xx, yy, -1);
    raydir.normalize();
    let pixel = raytrace(new Vec3(0, 0, 0), raydir, spheres, 0);
    store<i32>(changetype<usize>(buffer) + (y * width + x) * sizeof<i32>(), pixel.rgba);
  }
}

export const ArrayOfSpheres_ID = idof<Sphere[]>();
