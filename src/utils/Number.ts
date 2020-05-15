const smoothstep = (min: number, max: number, value: number): number => Math.max(0, Math.min(1, (value - min) / (max - min)))
const mix = (value1: number, value2: number, percent: number): number => value1 * (1 - percent) + value2 * percent
const clamp = (value: number, min: number = 0, max: number = 1): number => Math.max(min, Math.min(value, max))

const map = (value: number, min: number, max: number): number => clamp((value - min) / (max - min), 0, 1)
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const random = (min: number, max: number): number => Math.random() * (max - min) + min
const lerp = (v0: number, v1: number, t: number): number => v0 + t * (v1 - v0)

export {
  smoothstep,
  randomInt,
  random,
  clamp,
  lerp,
  map,
  mix
}
