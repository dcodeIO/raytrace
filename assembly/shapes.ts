import { Vec3 } from "./vec3";

export class Sphere {
  radiusSq: f32;
  
  constructor(
    public center: Vec3,
    public radius: f32,
    public surfaceColor: Vec3,
    public reflection: f32,
    public transparency: f32,
    public emissionColor: Vec3
  ) {
    this.radiusSq = radius * radius;
  }

  /** Computes the intersection of the given ray with this sphere, if any. */
  intersect(origin: Vec3, direction: Vec3): bool {
    var l = this.center.sub(origin);
    var t_ca = l.dot(direction);
    if (t_ca < 0) return false;
    var distanceSq = l.dot(l) - t_ca * t_ca;
    var radiusSq = this.radiusSq;
    if (distanceSq > radiusSq) return false;
    var t_hc = sqrt(radiusSq - distanceSq);
    Sphere.tNear = t_ca - t_hc;
    Sphere.tFar = t_ca + t_hc;
    return true;
  }

  static tNear: f32; // near intersection
  static tFar: f32; // far intersection
}
