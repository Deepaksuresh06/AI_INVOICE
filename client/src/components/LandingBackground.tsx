import React from "react";
import { AuroraBackground } from "./AuroraBackground";
import { Particles } from "./Particles";
import { MouseGlow } from "./MouseGlow";

export const LandingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#020617] overflow-hidden">
      <AuroraBackground />
      <Particles />
      <MouseGlow />
    </div>
  );
};
