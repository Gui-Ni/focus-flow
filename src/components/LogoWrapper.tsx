"use client";

import { motion } from "framer-motion";

type LogoSize = "sm" | "md" | "lg" | "xl";

// 按照你的 HTML 比例精确转换
// 原始尺寸: box 宽度 450px, 大圆 180px, 中圆 130px
const sizeConfig = {
  sm: {
    boxWidth: 45,
    largeCircle: 18,
    mediumCircle: 13,
    dotsRadius: 9.2,
    largeLeft: 6,
  },
  md: {
    boxWidth: 68,
    largeCircle: 27,
    mediumCircle: 19.5,
    dotsRadius: 13.8,
    largeLeft: 9,
  },
  lg: {
    boxWidth: 110,
    largeCircle: 44,
    mediumCircle: 32,
    dotsRadius: 22.5,
    largeLeft: 14.7,
  },
  xl: {
    boxWidth: 180,
    largeCircle: 72,
    mediumCircle: 52,
    dotsRadius: 36.8,
    largeLeft: 24,
  },
};

// 7个点的角度，保持你的弧度
const dotAngles = [-46, -31, -16, 0, 16, 31, 46];
const dotSizes = [3, 6, 10, 14, 10, 6, 3]; // 按照你的比例

export default function Logo({ size = "md" }: { size?: LogoSize }) {
  const config = sizeConfig[size];

  // 计算中圆位置: 大圆右边缘是 largeLeft + largeCircle = 240px 原始，这里按比例保持
  const mediumLeft = config.largeLeft + config.largeCircle - 1; // 239px 原始

  return (
    <div
      className="relative inline-block"
      style={{
        width: config.boxWidth,
        height: config.boxWidth * (250 / 450), // 保持原始 450:250 比例
      }}
    >
      {/* 左侧大圆 - 呼吸动画 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.largeCircle,
          height: config.largeCircle,
          left: config.largeLeft,
          top: "50%",
          marginTop: -config.largeCircle / 2,
          background: "linear-gradient(to right, #eaf4fd 0%, #68baf4 100%)",
        }}
        animate={{ scale: [1, 1.02, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 右侧中圆 - 呼吸动画延迟 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: config.mediumCircle,
          height: config.mediumCircle,
          left: mediumLeft,
          top: "50%",
          marginTop: -config.mediumCircle / 2,
          background: "linear-gradient(to right, #68baf4 0%, #eef7fc 100%)",
        }}
        animate={{ scale: [1, 1.03, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* 7个小圆点 - 完美弧度排列 */}
      {dotSizes.map((dotSize, i) => {
        const angleDeg = dotAngles[i];
        const angleRad = (angleDeg * Math.PI) / 180;
        // 原点在中圆圆心
        const centerX = mediumLeft + config.mediumCircle / 2;
        const centerY = config.boxWidth * (250 / 450) / 2;
        // 从中心旋转出去
        const x = centerX + Math.cos(angleRad) * config.dotsRadius;
        const y = centerY + Math.sin(angleRad) * config.dotsRadius;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: dotSize * (config.boxWidth / 450), // 按比例缩放
              height: dotSize * (config.boxWidth / 450),
              left: x - (dotSize * (config.boxWidth / 450)) / 2,
              top: y - (dotSize * (config.boxWidth / 450)) / 2,
              backgroundColor: "#7fcaea",
              boxShadow: "0 0 0 1px #ffffff",
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
