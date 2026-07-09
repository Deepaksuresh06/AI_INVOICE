import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { getMotionConfig } from "../motionconfig";

export const MouseGlow: React.FC = () => {
  const config = getMotionConfig();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { damping: 40 });
  const sy = useSpring(y, { damping: 40 });

  useEffect(() => {
    if (!config.enableMouseGlow) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!config.enableMouseGlow) return null;

  return (
    <motion.div
      className="fixed w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)",
      }}
    />
  );
};