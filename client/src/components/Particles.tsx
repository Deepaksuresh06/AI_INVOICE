import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { getMotionConfig } from "../motionconfig";
import type { Particle } from "../types";

export const Particles: React.FC = () => {
  const config = getMotionConfig();

  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: config.particleCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 20 + 10,
      })),
    [config.particleCount]
  );

  return (
    <div className="absolute inset-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full opacity-20"
          initial={{ x: `${p.x}%`, y: `${p.y}%` }}
          animate={{ y: [`${p.y}%`, `${p.y - 20}%`, `${p.y}%`] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
          }}
          style={{
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
};