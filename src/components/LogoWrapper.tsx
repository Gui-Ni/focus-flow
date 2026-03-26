"use client";

// Logo with animation - Client Component
import { motion } from "framer-motion";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: { box: 40, large: 32, medium: 24, dots: 18, dotSize: [1, 2, 3, 4, 3, 2, 1] as number[] },
    md: { box: 60, large: 48, medium: 35, dots: 26, dotSize: [2, 3, 4, 5, 4, 3, 2] as number[] },
    lg: { box: 100, large: 80, medium: 58, dots: 44, dotSize: [3, 4, 6, 8, 6, 4, 3] as number[] },
    xl: { box: 160, large: 128, medium: 92, dots: 70, dotSize: [4, 6, 9, 12, 9, 6, 4] as number[] },
  };

  const s = sizes[size];

  return (
    <div
      className="relative inline-block"
      style={{ width: s.box, height: s.box * 0.56 }}
    >
      {/* Large Circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s.large,
          height: s.large,
          left: 0,
          top: "50%",
          marginTop: -s.large / 2,
          background: "linear-gradient(to right, #eaf4fd 0%, #68baf4 100%)",
        }}
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Medium Circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s.medium,
          height: s.medium,
          left: s.large * 0.92,
          top: "50%",
          marginTop: -s.medium / 2,
          background: "linear-gradient(to right, #68baf4 0%, #eef7fc 100%)",
        }}
        animate={{
          scale: [1, 1.03, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* 7 Dots - Arc pattern */}
      {s.dotSize.map((dotSize, i) => {
        const angle = ((i - 3) / 6) * 80;
        const radius = s.dots;
        const x = Math.cos((angle * Math.PI) / 180) * radius + s.large * 0.6;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#7fcaea]"
            style={{
              width: dotSize,
              height: dotSize,
              left: "50%",
              top: "50%",
              marginLeft: x - dotSize / 2,
              marginTop: y - dotSize / 2,
              boxShadow: "0 0 4px rgba(127, 202, 234, 0.6)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        );
      })}
    </div>
  );
}

// Brand name with gradient
export function BrandName({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#68baf4] to-[#eef7fc] ${sizes[size]}`}>
      Focus Flow
    </span>
  );
}
