/**
 * Focus Flow - SYNC 专注特效组件（性能优化版）
 * 精神充能（能量球拖拽） + 灵感触发（漂浮点涟漪）
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============ 类型定义 ============
interface EnergyBall {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  hue: number;
  createdAt: number;
}

interface FloatingSpot {
  id: number;
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  phase: number;
  speed: number;
}

// ============ 精神充能模式 ============
export function EnergyBalls({
  onRecordAction,
}: {
  onRecordAction?: () => void;
}) {
  const BATCH_SIZE = 5;
  const [balls, setBalls] = useState<EnergyBall[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [centerGlow, setCenterGlow] = useState(0);
  const ballIdRef = useRef(0);
  const particleIdRef = useRef(0);

  // 生成新球
  const spawnBall = useCallback((): EnergyBall => {
    const id = ++ballIdRef.current;
    return {
      id,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 50,
      size: 52 + Math.random() * 16,
      hue: 200 + Math.random() * 30,
    };
  }, []);

  // 初始化
  useEffect(() => {
    setBalls(Array.from({ length: BATCH_SIZE }, spawnBall));
  }, [spawnBall]);

  // 消耗球
  const consumeBall = useCallback(
    (ball: EnergyBall, absX: number, absY: number) => {
      onRecordAction?.();

      // 生成粒子
      const newParticles: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 50 + Math.random() * 50;
        newParticles.push({
          id: ++particleIdRef.current,
          x: absX,
          y: absY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);
      setCenterGlow((prev) => Math.min(prev + 20, 100));

      setBalls((prev) => prev.filter((b) => b.id !== ball.id));
      setTimeout(() => {
        setBalls((prev) => [...prev, spawnBall()]);
      }, 400);
    },
    [onRecordAction, spawnBall]
  );

  // 粒子动画（简化：用 CSS 动画替代 JS）
  // 移除 JS 驱动，改用 CSS transition
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(8));
    }, 600);
    return () => clearTimeout(timer);
  }, [particles.length]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
      {/* 中心光晕 */}
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: 140 + centerGlow * 1.2,
          height: 140 + centerGlow * 1.2,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(79,172,254,${0.2 + centerGlow * 0.004}) 0%, transparent 70%)`,
          boxShadow: `0 0 ${50 + centerGlow}px rgba(79,172,254,${0.1 + centerGlow * 0.003})`,
        }}
      />
      <div
        className="absolute rounded-full transition-all duration-500"
        style={{
          width: 36 + centerGlow * 0.3,
          height: 36 + centerGlow * 0.3,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(255,255,255,${0.5 + centerGlow * 0.005}) 0%, rgba(79,172,254,0.2) 60%, transparent 100%)`,
        }}
      />

      {/* 能量球 */}
      <AnimatePresence>
        {balls.map((ball) => (
          <motion.div
            key={ball.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.18, 1, 0.32, 1] }}
            drag
            dragMomentum={false}
            dragElastic={0.02}
            onDragEnd={(_, info) => {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              const absX = (ball.x / 100) * window.innerWidth + info.offset.x;
              const absY = (ball.y / 100) * window.innerHeight + info.offset.y;
              const dist = Math.hypot(absX - centerX, absY - centerY);
              if (dist < 100) {
                consumeBall(ball, absX, absY);
              }
            }}
            whileHover={{ scale: 1.06 }}
            whileDrag={{ scale: 1.12, cursor: "grabbing" }}
            className="absolute"
            style={{
              left: `${ball.x}%`,
              top: `${ball.y}%`,
              width: ball.size,
              height: ball.size,
              marginLeft: -(ball.size / 2),
              marginTop: -(ball.size / 2),
              pointerEvents: "auto",
              cursor: "grab",
            }}
          >
            {/* 球体 */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `linear-gradient(135deg, hsla(${ball.hue},80%,72%,0.88) 0%, hsla(${ball.hue},60%,52%,0.65) 50%, hsla(${ball.hue},80%,68%,0.25) 100%)`,
                boxShadow: `0 0 ${ball.size * 0.5}px hsla(${ball.hue},80%,60%,0.35), inset 0 0 ${ball.size * 0.25}px rgba(255,255,255,0.25)`,
                border: `1px solid hsla(${ball.hue},80%,82%,0.45)`,
              }}
            >
              {/* 高光 */}
              <div
                className="absolute rounded-full"
                style={{
                  width: ball.size * 0.28,
                  height: ball.size * 0.28,
                  top: ball.size * 0.1,
                  left: ball.size * 0.14,
                  background: "radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)",
                }}
              />
              {/* 脉冲内核 */}
              <div
                className="absolute rounded-full animate-ping"
                style={{
                  width: ball.size * 0.35,
                  height: ball.size * 0.35,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: `hsla(${ball.hue},80%,82%,0.35)`,
                  animationDuration: "2.5s",
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 粒子（CSS 驱动） */}
      <AnimatePresence>
        {particles.slice(-16).map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              left: p.x,
              top: p.y,
              marginLeft: -2,
              marginTop: -2,
              background: `rgba(79,172,254,0.7)`,
              boxShadow: "0 0 6px rgba(79,172,254,0.5)",
              animation: "particleFly 0.6s ease-out forwards",
            }}
          />
        ))}
      </AnimatePresence>

      {/* 提示文字 */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[#4FACFE]/60 text-xs tracking-[0.2em] uppercase mb-0.5">
          Drag orbs to center
        </p>
        <p className="text-[#4FACFE]/30 text-[10px] tracking-wider">将能量球拖拽至中心</p>
      </div>

      {/* 进度指示 */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i < Math.floor(centerGlow / 20) ? "#4FACFE" : "rgba(79,172,254,0.2)",
              boxShadow: i < Math.floor(centerGlow / 20) ? "0 0 6px rgba(79,172,254,0.6)" : "none",
            }}
          />
        ))}
      </div>

      {/* 粒子动画样式 */}
      <style>{`
        @keyframes particleFly {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </div>
  );
}

// ============ 灵感触发模式 ============
export function InspirationRipples({
  onRecordAction,
}: {
  onRecordAction?: () => void;
}) {
  const [spots, setSpots] = useState<FloatingSpot[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const spotIdRef = useRef(0);
  const timeRef = useRef(0);

  // 生成新灵感点
  const spawnSpot = useCallback((): FloatingSpot => {
    const id = ++spotIdRef.current;
    const anchorX = 12 + Math.random() * 76;
    const anchorY = 20 + Math.random() * 45;
    return {
      id,
      anchorX,
      anchorY,
      x: anchorX,
      y: anchorY,
      size: 44 + Math.random() * 20,
      hue: 260 + Math.random() * 60,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.4,
    };
  }, []);

  // 初始化
  useEffect(() => {
    setSpots(Array.from({ length: 6 }, spawnSpot));
  }, [spawnSpot]);

  // 漂浮动画（每 60ms 更新一次，避免频繁 re-render）
  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current += 0.06;
      setSpots((prev) =>
        prev.map((s) => ({
          ...s,
          x: s.anchorX + Math.sin(timeRef.current * s.speed + s.phase) * 3,
          y: s.anchorY + Math.cos(timeRef.current * s.speed * 0.7 + s.phase) * 2,
        }))
      );
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // 点击灵感点
  const handleSpotClick = useCallback(
    (spot: FloatingSpot, clickX: number, clickY: number) => {
      onRecordAction?.();

      const rippleId = Date.now();
      setRipples((prev) => [
        ...prev,
        { id: rippleId, x: clickX, y: clickY, hue: spot.hue, createdAt: Date.now() },
      ]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 1800);

      setSpots((prev) => prev.filter((s) => s.id !== spot.id));
      setTimeout(() => {
        setSpots((prev) => (prev.length < 6 ? [...prev, spawnSpot()] : prev));
      }, 350);
    },
    [onRecordAction, spawnSpot]
  );

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
      {/* 背景微光 */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(168,85,247,0.05) 0%, transparent 70%)",
        }}
      />

      {/* 涟漪（最多 3 组） */}
      <AnimatePresence>
        {ripples.slice(-3).map((ripple) => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{ left: ripple.x, top: ripple.y }}
          >
            {[0, 1, 2].map((ring) => (
              <div
                key={ring}
                className="absolute rounded-full"
                style={{
                  width: 60,
                  height: 60,
                  left: -30,
                  top: -30,
                  border: `1px solid hsla(${ripple.hue},80%,75%,0.5)`,
                  boxShadow: `0 0 8px hsla(${ripple.hue},80%,70%,0.25)`,
                  animation: `rippleOut 1.4s ease-out ${ring * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* 灵感点 */}
      <AnimatePresence>
        {spots.map((spot) => (
          <motion.div
            key={spot.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{
              scale: { duration: 0.45, ease: [0.18, 1, 0.32, 1] },
              opacity: { duration: 0.25 },
              rotate: { duration: 0.25 },
            }}
            className="absolute"
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              width: spot.size,
              height: spot.size,
              marginLeft: -(spot.size / 2),
              marginTop: -(spot.size / 2),
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={(e) => handleSpotClick(spot, e.clientX, e.clientY)}
          >
            {/* 外层辉光 */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, hsla(${spot.hue},80%,70%,0.2) 0%, transparent 70%)`,
              }}
            />
            {/* 主球体 */}
            <div
              className="relative w-full h-full rounded-full"
              style={{
                background: `linear-gradient(135deg, hsla(${spot.hue},80%,82%,0.9) 0%, hsla(${spot.hue + 30},70%,62%,0.7) 50%, hsla(${spot.hue - 20},60%,52%,0.5) 100%)`,
                boxShadow: `0 0 ${spot.size * 0.45}px hsla(${spot.hue},80%,65%,0.35), inset 0 0 ${spot.size * 0.2}px rgba(255,255,255,0.3)`,
                border: `1px solid hsla(${spot.hue},80%,90%,0.4)`,
              }}
            >
              {/* 高光 */}
              <div
                className="absolute rounded-full"
                style={{
                  width: spot.size * 0.26,
                  height: spot.size * 0.26,
                  top: spot.size * 0.1,
                  left: spot.size * 0.14,
                  background: "radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 70%)",
                }}
              />
              {/* 脉冲内核 */}
              <div
                className="absolute rounded-full animate-ping"
                style={{
                  width: spot.size * 0.28,
                  height: spot.size * 0.28,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: `hsla(${spot.hue},80%,90%,0.4)`,
                  animationDuration: "2s",
                  animationIterationCount: "infinite",
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 提示文字 */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white/45 text-xs tracking-[0.2em] uppercase mb-0.5">
          Tap floating sparks
        </p>
        <p className="text-white/22 text-[10px] tracking-wider">点击漂浮的灵感点</p>
      </div>

      {/* 涟漪动画样式 */}
      <style>{`
        @keyframes rippleOut {
          0% { transform: scale(0.3); opacity: 0.6; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ============ 背景光效 ============
export function AmbientGlow({
  active = true,
}: {
  active?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79,172,254,0.1) 0%, transparent 65%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={active ? { scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] } : {}}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}

// ============ SYNC Logo（保留导出，其他地方可能用到）============
export function SyncLogo({
  size = 80,
  isBreathing = true,
  isSyncing = false,
}: {
  size?: number;
  isBreathing?: boolean;
  isSyncing?: boolean;
}) {
  const baseSize = size;
  const midSize = size * 0.75;

  const dots = [
    { size: 3, y: -35, x: 0 },
    { size: 5, y: -20, x: 8 },
    { size: 6, y: -4, x: 12 },
    { size: 8, y: 12, x: 12 },
    { size: 6, y: 28, x: 8 },
    { size: 5, y: 44, x: 0 },
    { size: 3, y: 60, x: -8 },
  ];

  return (
    <div className="flex items-center justify-center select-none">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={isBreathing || isSyncing ? { scale: [1, 0.92, 1], opacity: [0.9, 0.65, 0.9] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20 rounded-full"
          style={{
            width: baseSize,
            height: baseSize,
            background: "linear-gradient(135deg, #4FACFE 0%, rgba(255,255,255,0.92) 100%)",
            boxShadow: "0 0 40px rgba(79,172,254,0.6), 0 0 80px rgba(79,172,254,0.25)",
          }}
        />
        <motion.div
          animate={isBreathing || isSyncing ? { scale: [1, 0.88, 1], opacity: [0.75, 0.5, 0.75] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="relative z-10 rounded-full"
          style={{
            width: midSize,
            height: midSize,
            marginLeft: "-4px",
            background: "linear-gradient(135deg, #4FACFE 0%, rgba(255,255,255,0.7) 100%)",
          }}
        />
        <div className="relative h-full ml-3 flex items-center">
          {dots.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute bg-[#4FACFE] rounded-full"
              animate={isBreathing || isSyncing ? { opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] } : { opacity: 0.6 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              style={{
                width: dot.size,
                height: dot.size,
                top: `calc(50% + ${dot.y}px - ${dot.size / 2}px)`,
                left: `${dot.x}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
