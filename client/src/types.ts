export type Particle = {
  x: number;
  y: number;
  size: number;
  duration: number;
};

export type MotionConfig = {
  particleCount: number;
  enableMouseGlow: boolean;
};