/**
 * 毕设 SYNC·心跃 视觉特效组件 - 完整版
 * 提取自 bishe-cp/src/App.tsx，适配 Focus Flow
 */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

// ============ 类型定义 ============
interface EnergyBall {
  id: number;
  isConsumed: boolean;
  x: number;
  y: number;
  size: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Spark {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface RandomSpot {
  id: number;
  x: number;
  y: number;
  size: number;
}

// ============ SYNC Logo 组件 ============
export function SyncLogo({ 
  size = 160, 
  isBreathing = true,
  isSyncing = false,
  className = ""
}: { 
  size?: number; 
  isBreathing?: boolean;
  isSyncing?: boolean;
  className?: string;
}) {
  const baseSize = size;
  const midSize = size * 0.75;
  
  const dots = [
    { size: 4, y: -45, x: 0 },
    { size: 6, y: -25, x: 10 },
    { size: 8, y: -5, x: 15 },
    { size: 10, y: 15, x: 15 },
    { size: 8, y: 35, x: 10 },
    { size: 6, y: 55, x: 0 },
    { size: 4, y: 75, x: -10 },
  ];

  return (
    <div className={`flex items-center justify-center ${!isBreathing ? 'breathing' : ''} ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* 主光球 */}
        <motion.div
          animate={isSyncing ? { 
            scale: [1, 0.95, 1], 
            opacity: [0.9, 0.7, 0.9] 
          } : isBreathing ? {
            scale: [1, 0.95, 1],
            opacity: [0.9, 0.7, 0.9]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20 rounded-full"
          style={{
            width: baseSize,
            height: baseSize,
            background: 'linear-gradient(to left, #4FACFE 0%, rgba(255, 255, 255, 0.9) 100%)',
          }}
        />
        
        {/* 内层光晕 */}
        <motion.div
          animate={isSyncing ? { 
            scale: [1, 0.9, 1], 
            opacity: [0.8, 0.6, 0.8] 
          } : isBreathing ? {
            scale: [1, 0.9, 1],
            opacity: [0.8, 0.6, 0.8]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 rounded-full"
          style={{
            width: midSize,
            height: midSize,
            marginLeft: '-2px',
            background: 'linear-gradient(to right, #4FACFE 0%, rgba(255, 255, 255, 0.9) 100%)',
          }}
        />
        
        {/* 弧形点 */}
        {size >= 100 && (
          <div className="relative h-full ml-4 flex items-center">
            {dots.map((dot, i) => (
              <motion.div
                key={i}
                className="absolute bg-[#4FACFE] rounded-full opacity-90"
                animate={isBreathing || isSyncing ? { opacity: [0.4, 0.9, 0.4] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  width: dot.size,
                  height: dot.size,
                  top: `calc(50% + ${dot.y}px - ${dot.size / 2}px)`,
                  left: `${dot.x}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ 能量球组件（精神充能模式）============
export function EnergyBalls({ 
  onBallConsumed,
  ballCount = 8,
  pushProgress = 0,
  onRecordAction,
}: { 
  onBallConsumed?: (id: number) => void;
  ballCount?: number;
  pushProgress?: number;
  onRecordAction?: () => void;
}) {
  const [balls, setBalls] = useState<EnergyBall[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // 初始化能量球
  const initBalls = useCallback(() => {
    const newBalls: EnergyBall[] = [];
    const w = typeof window !== 'undefined' ? window.innerWidth : 800;
    const h = typeof window !== 'undefined' ? window.innerHeight : 600;
    setContainerSize({ width: w, height: h });
    
    for (let i = 0; i < ballCount; i++) {
      newBalls.push({
        id: Date.now() + i,
        isConsumed: false,
        x: (Math.random() - 0.5) * w * 0.8,
        y: h * 0.2 + Math.random() * h * 0.3,
        size: 48 + Math.random() * 16,
      });
    }
    setBalls(newBalls);
  }, [ballCount]);

  useEffect(() => {
    initBalls();
  }, [initBalls]);

  // 拖拽结束处理
  const handleDragEnd = useCallback((ballId: number, info: PanInfo) => {
    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;
    const dist = Math.sqrt(
      Math.pow(info.offset.x + containerSize.width/2 - centerX, 2) + 
      Math.pow(info.offset.y + containerSize.height/2 - centerY, 2)
    );
    
    if (dist < 150) {
      // 消耗能量球
      setBalls(prev => prev.map(b => 
        b.id === ballId ? { ...b, isConsumed: true } : b
      ));
      onBallConsumed?.(ballId);
      onRecordAction?.();
      
      // 动画后移除
      setTimeout(() => {
        setBalls(prev => prev.filter(b => b.id !== ballId));
        
        // 在安全区重新生成
        const bounds = { xRange: containerSize.width * 0.75, yMin: containerSize.height * 0.2, yMax: containerSize.height * 0.5 };
        setBalls(prev => [...prev, {
          id: Date.now(),
          isConsumed: false,
          x: (Math.random() - 0.5) * bounds.xRange,
          y: bounds.yMin + Math.random() * (bounds.yMax - bounds.yMin),
          size: 48 + Math.random() * 16,
        }]);
      }, 300);
    }
  }, [containerSize, onBallConsumed, onRecordAction]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 中心光晕 */}
      <div 
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#4FACFE] blur-[60px] transition-all duration-75 pointer-events-none"
        style={{ 
          opacity: (pushProgress / 100) * 0.8, 
          transform: `translate(-50%, -50%) scale(${0.5 + (pushProgress / 100) * 0.8})` 
        }}
      />

      {/* 能量球 */}
      {balls.map((ball) => (
        !ball.isConsumed && (
          <motion.div
            key={ball.id}
            drag
            dragConstraints={{
              left: -containerSize.width/2 + 30,
              right: containerSize.width/2 - 30,
              top: -containerSize.height/2 + 30,
              bottom: containerSize.height/2 - 30,
            }}
            onDragEnd={(_, info) => handleDragEnd(ball.id, info)}
            initial={{ scale: 0, opacity: 0, x: ball.x, y: ball.y }}
            animate={{ 
              scale: ball.isConsumed ? 0 : ball.size,
              opacity: ball.isConsumed ? 0 : 1,
            }}
            transition={{ 
              duration: ball.isConsumed ? 0.3 : 0.8, 
              ease: ball.isConsumed ? "backIn" : "easeOut" 
            }}
            className="absolute w-12 h-12 rounded-full bg-[#4FACFE]/30 backdrop-blur-md border border-[#4FACFE]/50 cursor-grab active:cursor-grabbing pointer-events-auto shadow-[0_0_20px_rgba(79,172,254,0.3)] flex items-center justify-center"
            style={{ 
              left: '50%', 
              top: '50%', 
              x: ball.x, 
              y: ball.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* 内部呼吸光 */}
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-[#4FACFE]/60 blur-[6px]" 
            />
          </motion.div>
        )
      ))}
      
      {/* 提示文字 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[#4FACFE] tracking-[0.3em] text-xs">将散落的思维球拖拽至中心聚拢</p>
      </div>
    </div>
  );
}

// ============ 灵感涟漪组件（灵感触发模式）============
export function InspirationRipples({ 
  active = true,
  rippleCount = 8,
  onSpotClick,
}: { 
  active?: boolean;
  rippleCount?: number;
  onSpotClick?: () => void;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [randomSpots, setRandomSpots] = useState<RandomSpot[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // 初始化灵感点
  const initSpots = useCallback(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 800;
    const h = typeof window !== 'undefined' ? window.innerHeight : 600;
    setContainerSize({ width: w, height: h });
    
    const newSpots: RandomSpot[] = [];
    for (let i = 0; i < rippleCount; i++) {
      newSpots.push({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * w * 0.7,
        y: h * 0.2 + Math.random() * h * 0.35,
        size: 0.6 + Math.random() * 0.4,
      });
    }
    setRandomSpots(newSpots);
  }, [rippleCount]);

  useEffect(() => {
    if (active) {
      initSpots();
    }
  }, [active, initSpots]);

  // 点击灵感点处理
  const handleSpotClick = useCallback((e: React.PointerEvent, spot: RandomSpot) => {
    e.stopPropagation();
    
    // 1. 生成涟漪
    const clientX = e.clientX;
    const clientY = e.clientY;
    const newRippleId = Date.now();
    setRipples(prev => [...prev, { id: newRippleId, x: clientX, y: clientY }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRippleId)), 2500);

    // 2. 生成向外发射的火花
    const particleCount = 12;
    const newSparks: Spark[] = [...Array(particleCount)].map(() => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 150 + Math.random() * 150;
      return {
        id: Math.random(),
        startX: clientX,
        startY: clientY,
        endX: clientX + Math.cos(angle) * velocity,
        endY: clientY + Math.sin(angle) * velocity,
      };
    });
    setSparks(prev => [...prev, ...newSparks]);
    setTimeout(() => {
      const sparkIds = newSparks.map(s => s.id);
      setSparks(prev => prev.filter(s => !sparkIds.includes(s.id)));
    }, 800);

    // 3. 移除被点击的点并记录
    setRandomSpots(prev => prev.filter(s => s.id !== spot.id));
    onSpotClick?.();

    // 4. 在安全区重新生成
    setTimeout(() => {
      const bounds = { xRange: containerSize.width * 0.75, yMin: containerSize.height * 0.2, yMax: containerSize.height * 0.55 };
      setRandomSpots(prev => [...prev, {
        id: Date.now(),
        x: (Math.random() - 0.5) * bounds.xRange,
        y: bounds.yMin + Math.random() * (bounds.yMax - bounds.yMin),
        size: 0.6 + Math.random() * 0.8,
      }]);
    }, 500);
  }, [containerSize, onSpotClick]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 灵感点 */}
      <AnimatePresence>
        {randomSpots.map((spot) => (
          <motion.div
            key={spot.id}
            initial={{ opacity: 0, scale: 0, x: spot.x, y: spot.y }}
            animate={{ opacity: 1, scale: spot.size, x: spot.x, y: spot.y }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute flex items-start justify-center pointer-events-auto"
            style={{ left: '50%', top: '50%' }}
          >
            <div
              className="w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer pointer-events-auto hover:bg-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              onPointerDown={(e) => handleSpotClick(e, spot)}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute w-4 h-4 bg-white rounded-full blur-[2px]"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 涟漪特效 */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* 火花特效 */}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ scale: 1, opacity: 1, x: spark.startX, y: spark.startY }}
          animate={{ scale: 0, opacity: 0, x: spark.endX, y: spark.endY }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-3 h-3 bg-white rounded-full blur-[1px] shadow-[0_0_15px_#4FACFE] pointer-events-none"
        />
      ))}

      {/* 提示文字 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white/60 tracking-[0.3em] text-xs">点击漂浮的灵感点捕获创意</p>
      </div>
    </div>
  );
}

// ============ 背景光效组件 ============
export function AmbientGlow({ 
  active = true,
  color = "#4FACFE"
}: { 
  active?: boolean;
  color?: string;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={active ? {
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}

// ============ 底部弧形遮罩 ============
export function BottomArcMask() {
  return (
    <div 
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200vw] md:w-[800px] h-[300px] border-t-[30px] border-[#4FACFE]/10 rounded-t-[1000px] pointer-events-none"
      style={{ 
        maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
      }}
    />
  );
}
