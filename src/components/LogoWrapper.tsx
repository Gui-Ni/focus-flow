"use client";

import { motion } from "framer-motion";

type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeConfig = {
  sm: {
    boxWidth: 40,
    largeSize: 32,
    mediumSize: 24,
    dotsRadius: 18,
    dotSizes: [1, 2, 3, 4, 3, 2, 1],
  },
  md: {
    boxWidth: 60,
    largeSize: 48,
    mediumSize: 35,
    dotsRadius: 26,
    dotSizes: [2, 3, 4, 5, 4, 3, 2],
  },
  lg: {
    boxWidth: 100,
    largeSize: 80,
    mediumSize: 58,
    dotsRadius: 44,
    dotSizes: [3, 4, 6, 8, 6, 4, 3],
  },
  xl: {
    boxWidth: 160,
    largeSize: 128,
    mediumSize: 92,
    dotsRadius: 70,
    dotSizes: [4, 6, 9, 12, 9, 6, 4],
  },
};

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  const config = sizeConfig[size];

  return (
    <div
      className="relative inline-block"
      style={{ width: config.boxWidth, height: config.boxWidth * 0.56 }}
    >
      {/* Large Circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.largeSize,
          height: config.largeSize,
          left: 0,
          top: "50%",
          marginTop: -config.largeSize / 2,
          background: "linear-gradient(to right, #eaf4fd 0%, #68baf4 100%)",
        }}
        animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Medium Circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.mediumSize,
          height: config.mediumSize,
          left: config.largeSize * 0.92,
          top: "50%",
          marginTop: -config.mediumSize / 2,
          background: "linear-gradient(to right, #68baf4 0%, #eef7fc 100%)",
        }}
        animate={{ scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* 7 Dots - Arc pattern */}
      {config.dotSizes.map((dotSize, i) => {
        const angleDeg = ((i - 3) / 6) * 80;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = Math.cos(angleRad) * config.dotsRadius + config.largeSize * 0.6;
        const y = Math.sin(angleRad) * config.dotsRadius;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: dotSize,
              height: dotSize,
              left: "50%",
              top: "50%",
              marginLeft: x - dotSize / 2,
              marginTop: y - dotSize / 2,
              backgroundColor: "#7fcaea",
              boxShadow: "0 0 4px rgba(127, 202, 234, 0.6)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        );
      })}
    </div>
  );
}

// Brand name with gradient
export function BrandName({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizes = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };
  return (
    <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#68baf4] to-[#eef7fc] ${textSizes[size]}`}>
      Focus Flow
    </span>
  );
}
