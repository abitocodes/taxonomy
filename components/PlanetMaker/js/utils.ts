import p5Types from "p5";
import alea from 'alea';
// import SimplexNoise from '@spissvinkel/simplex-noise';
import { mkSimplexNoise, SimplexNoise } from '@spissvinkel/simplex-noise';
import { rng } from ".";

// 유틸리티 함수들
export const PI2 = Math.PI * 2;

export function mod(a: number, b: number): number {
  return (a % b + b) % b;
}

export function init<T>(arg: T | undefined, def: T): T {
  return arg === undefined ? def : arg;
}

export function pSet(p: p5Types, x: number, y: number, c: p5Types.Color | null): void {
  if (c === null || (x < 0 || p.width <= x) || (y < 0 || p.height <= y)) { return; }
  p.set(x, y, c);
}

export function textb(p: p5Types, str: string, x: number, y: number, border: p5Types.Color, body: p5Types.Color): void {
  p.fill(border);
  p.text(str, x - 1, y);
  p.text(str, x + 1, y);
  p.text(str, x, y - 1);
  p.text(str, x, y + 1);
  p.fill(body);
  p.text(str, x, y);
}

export function weightedChoiceIndex(length: number, weight: number[], value: number): number {
  const totalWeight = weight.reduce((sum, val) => sum + val, 0);
  let threshold = value * totalWeight;
  for (let i = 0; i < length; i++) {
    if (threshold <= weight[i]) {
      return i;
    }
    threshold -= weight[i];
  }
  return length - 1;
}

export function weightedChoice<T>(array: T[], weight: number[], value: number = rng.random()): T {
  return array[weightedChoiceIndex(array.length, weight, value)];
}

export class Grid<T> {
  width: number;
  height: number;
  table: T[];

  constructor(width: number, height: number, init: T) {
    this.width = width;
    this.height = height;
    this.table = new Array(this.width * this.height).fill(init);
  }

  set(x: number, y: number, val: T): void {
    if (x < 0 || this.width <= x) {
      throw new RangeError(`The argument must be between x ${0} and ${this.width - 1}.`);
    } else if (y < 0 || this.height <= y) {
      throw new RangeError(`The argument must be between y ${0} and ${this.height - 1}.`);
    } else {
      this.table[y * this.width + x] = val;
    }
  }

  get(x: number, y: number): T {
    x = mod(x, this.width);
    y = mod(y, this.height);
    return this.table[y * this.width + x];
  }
}

export class Random {
  seed: number;
  rng: ReturnType<typeof alea>;

  constructor(seed?: number) {
    this.seed = init(seed, Math.random());
    this.rng = alea(this.seed);
  }

  random(): number { return this.rng(); }
  randint(min: number, max: number): number { return Math.floor(this.random() * (max - min) + min); }
  uniform(min: number, max: number): number { return this.random() * (max - min) + min; }
}

export class NoiseGenerator {
  seed: number;
  simplex: SimplexNoise;

  constructor(seed?: number) {
    this.seed = init(seed, Math.random());
    this.simplex = mkSimplexNoise(alea(this.seed));
  }

  _noise3D(x: number, y: number, z: number, noiseScale: number = 1): number {
    return this.simplex.noise3D(x * noiseScale, y * noiseScale, z * noiseScale) * 0.5 + 0.5;
  }

  _ridged(x: number, y: number, z: number, noiseScale: number = 1): number {
    return Math.abs(this.simplex.noise3D(x * noiseScale, y * noiseScale, z * noiseScale));
  }

  _fbm(func: (x: number, y: number, z: number, noiseScale: number) => number, x: number, y: number, z: number, octaves: number = 6): number {
    let result = 0;
    let denom = 0;
    for (let o = 0; o < octaves; o++) {
      const ampl = Math.pow(0.5, o);
      result += ampl * func(x, y, z, Math.pow(2, o));
      denom += ampl;
    }
    return result / denom;
  }

  simplexFbm(x: number, y: number, z: number, octaves: number = 6): number {
    return this._fbm(this._noise3D.bind(this), x, y, z, octaves);
  }

  ridgedFbm(x: number, y: number, z: number, octaves: number = 6): number {
    return 1 - this._fbm(this._ridged.bind(this), x, y, z, octaves);
  }

  domainWarping(x: number, y: number, z: number, octaves: number = 6): number {
    const n = this._noise3D(x, y, z);
    return this.simplexFbm(x + n, y + n, z + n, octaves);
  }
}

// Properties 열거형 정의
export namespace Properties {
  export enum Draw {
    Front,
    Back
  }

  export enum Noise {
    Simplex,
    Ridged,
    DomainWarping,
    VStripe,
    HStripe,
    Gradation
  }

  export enum Color {
    Analogous,
    Complementary,
    SplitComplementary,
    Triad,
    Cavity,
    Earth
  }
}

interface ColorProperty {
  h: { offset: number; range: number };
  s: { offset: number; range: number };
  b: { offset: number; range: number };
}

export class Palette {
  mode: Properties.Color;
  h: number;
  background: p5Types.Color;
  cloud: p5Types.Color[];
  satellite: p5Types.Color[];
  star: p5Types.Color[];
  planet: (p5Types.Color | null)[];

  constructor(mode: Properties.Color, p: p5Types, rng: Random) {
    this.mode = mode;
    this.h = rng.randint(0, 360);

    this.background = this.parseColor(p, rng,
      { h: { offset: this.h + 180, range: 20 }, s: { offset: 15, range: 0 }, b: { offset: 15, range: 0 } }
    );
    this.cloud = [
      { h: { offset: this.h, range: 20 }, s: { offset: 10, range: 10 }, b: { offset: 100, range: 0 } },
      { h: { offset: this.h, range: 20 }, s: { offset: 10, range: 10 }, b: { offset: 80, range: 0 } }
    ].map(prop => this.parseColor(p, rng, prop));
    this.satellite = [
      { h: { offset: this.h + 45, range: 20 }, s: { offset: 30, range: 10 }, b: { offset: 90, range: 10 } },
      { h: { offset: this.shiftHue(this.h + 45), range: 20 }, s: { offset: 50, range: 10 }, b: { offset: 70, range: 10 } }
    ].map(prop => this.parseColor(p, rng, prop));
    this.star = [
      { h: { offset: this.h + 180, range: 20 }, s: { offset: 10, range: 0 }, b: { offset: 100, range: 0 } },
      { h: { offset: this.h + 180, range: 20 }, s: { offset: 20, range: 0 }, b: { offset: 40, range: 0 } }
    ].map(prop => this.parseColor(p, rng, prop));

    this.planet = this.generatePlanetColors(p, rng);
  }

  private generatePlanetColors(p: p5Types, rng: Random): (p5Types.Color | null)[] {
    switch (this.mode) {
      case Properties.Color.Analogous:
        return [
          { h: { offset: this.h, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 90, range: 10 } },
          { h: { offset: this.shiftHue(this.h, 15), range: 10 }, s: { offset: 65, range: 10 }, b: { offset: 75, range: 10 } },
          { h: { offset: this.shiftHue(this.h, 30), range: 10 }, s: { offset: 70, range: 10 }, b: { offset: 60, range: 10 } }
        ].map(prop => this.parseColor(p, rng, prop));
      case Properties.Color.Complementary:
        return [
          { h: { offset: this.shiftHue(this.h, 15), range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 75, range: 10 } },
          { h: { offset: this.h, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 90, range: 10 } },
          { h: { offset: this.h + 180, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 90, range: 10 } }
        ].map(prop => this.parseColor(p, rng, prop));
      case Properties.Color.SplitComplementary:
        return [
          { h: { offset: this.h + 160, range: 10 }, s: { offset: 40, range: 10 }, b: { offset: 90, range: 10 } },
          { h: { offset: this.h, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 90, range: 10 } },
          { h: { offset: this.h + 200, range: 10 }, s: { offset: 40, range: 10 }, b: { offset: 90, range: 10 } },
        ].map(prop => this.parseColor(p, rng, prop));
      case Properties.Color.Triad:
        return [
          { h: { offset: this.h + 120, range: 10 }, s: { offset: 40, range: 10 }, b: { offset: 90, range: 10 } },
          { h: { offset: this.h, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 90, range: 10 } },
          { h: { offset: this.h + 240, range: 10 }, s: { offset: 40, range: 10 }, b: { offset: 90, range: 10 } },
        ].map(prop => this.parseColor(p, rng, prop));
      case Properties.Color.Cavity:
        return [
          null,
          { h: { offset: this.h, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 90, range: 10 } },
          null
        ].map(prop => prop === null ? null : this.parseColor(p, rng, prop));
      case Properties.Color.Earth:
        this.cloud = [
          { h: { offset: this.h, range: 0 }, s: { offset: 2, range: 4 }, b: { offset: 98, range: 4 } },
          { h: { offset: 0, range: 0 }, s: { offset: 0, range: 0 }, b: { offset: 80, range: 0 } }
        ].map(prop => this.parseColor(p, rng, prop));
        return [
          { h: { offset: 210, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 85, range: 10 } },
          { h: { offset: 200, range: 10 }, s: { offset: 60, range: 10 }, b: { offset: 85, range: 10 } },
          { h: { offset: 135, range: 10 }, s: { offset: 70, range: 10 }, b: { offset: 90, range: 10 } }
        ].map(prop => this.parseColor(p, rng, prop));
      default:
        return [];
    }
  }

  shiftHue(hue: number, dist: number = 15): number {
    hue = mod(hue, 360);
    if (240 - dist <= hue && hue <= 240 + dist)
      return 240;
    if (60 < hue && hue < 225)
      return hue + dist;
    return mod(hue - dist, 360);
  }

  parseColor(p: p5Types, rng: Random, prop: ColorProperty): p5Types.Color {
    return p.color(
      mod(rng.randint(-prop.h.range / 2, prop.h.range / 2) + prop.h.offset, 360),
      rng.randint(-prop.s.range / 2, prop.s.range / 2) + prop.s.offset,
      rng.randint(-prop.b.range / 2, prop.b.range / 2) + prop.b.offset
    );
  }
}