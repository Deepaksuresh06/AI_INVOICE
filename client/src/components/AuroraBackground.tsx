import React from "react";
import { motion } from "framer-motion";

export const AuroraBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        animate={{
          x: ["10%", "20%", "10%"],
          y: ["20%", "30%", "20%"],
        }}
        transition={{ duration: 30, repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)",
        }}
      />
    </div>
  );
};