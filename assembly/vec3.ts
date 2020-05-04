export class Vec3 {
  constructor(
    public x: f32,
    public y: f32,
    public z: f32
  ) { }

  get length(): f32 {
    return sqrt<f32>(this.lengthSq);
  }

  get lengthSq(): f32 {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return x * x + y * y + z * z;
  }

  add(other: Vec3): Vec3 {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  sub(other: Vec3): Vec3 {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  mul(other: Vec3): Vec3 {
    return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  smul(factor: f32): Vec3 {
    return new Vec3(this.x * factor, this.y * factor, this.z * factor);
  }

  dot(other: Vec3): f32 {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  neg(): Vec3 {
    return new Vec3(-this.x, -this.y, -this.z);
  }

  normalize(): void {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var lengthSq = this.lengthSq;
    if (lengthSq > 0) {
      let invLengthSq: f32 = 1.0 / sqrt<f32>(lengthSq);
      this.x = x * invLengthSq;
      this.y = y * invLengthSq;
      this.z = z * invLengthSq;
    }
  }

  get rgba(): i32 {
    return (
       <i32>(min<f32>(this.x, 1.0) * 255)        | // R
      (<i32>(min<f32>(this.y, 1.0) * 255) <<  8) | // G
      (<i32>(min<f32>(this.z, 1.0) * 255) << 16) | // B
      0xff000000                                   // a
    );
  }
}
