import type { MotionConfig } from "./types";

export const getMotionConfig = (): MotionConfig => {
  const isMobile = window.innerWidth < 768;

  return {
    particleCount: isMobile ? 20 : 60,
    enableMouseGlow: !isMobile,
  };
};