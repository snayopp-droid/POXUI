export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const cl = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const ramp = (x: number, a: number, b: number) => cl((x - a) / (b - a));
export const eio = (x: number) => {
  const v = cl(x);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
};
export const eout = (x: number) => 1 - Math.pow(1 - cl(x), 3);
