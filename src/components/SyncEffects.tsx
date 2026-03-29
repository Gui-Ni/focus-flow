/**
 * Focus Flow 专注模式特效组件 - 修复版
 */
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";

// ============ 类型定义 ============
interface EnergyBall {
  id: number;
  isConsumed: boolean;
  x: number;
  y: number;
}

interface InspirationSpot {
  id: number;
  x: number;
  y: number;
  scale: number;
}

// ============ SYNC Logo ============
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
  
  const dots = useMemo(() => [
    { size: 3, y: -35, x: 0 },
    { size: 5, y: -20, x: 8 },
    { size: 6, y: -4, x: 12 },
    { size: 8, y: 12, x: 12 },
    { size: 6, y: 28, x: 8 },
    { size: 5, y: 44, x: 0 },
    { size: 3, y: 60, x: -8 },
  ], []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={isBreathing || isSyncing ? { 
            scale: [1, 0.95, 1], 
            opacity: [0.9, 0.7, 0.9] 
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-20 rounded-full"
          style={{
            width: baseSize,
            height: baseSize,
            background: 'linear-gradient(135deg, #4FACFE 0%, rgba(255, 255, 255, 0.9) 100%)',
            boxShadow: '0 0 30px rgba(79, 172, 254, 0.5)',
          }}
        />
        
        <motion.div
          animate={isBreathing || isSyncing ? { 
            scale: [1, 0.9, 1], 
            opacity: [0.8, 0.6, 0.8] 
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 rounded-full"
          style={{
            width: midSize,
            height: midSize,
            marginLeft: '-4px',
            background: 'linear-gradient(135deg, #4FACFE 0%, rgba(255, 255, 255, 0.7) 100%)',
            opacity: 0.7,
          }}
        />
        
        <div className="relative h-full ml-3 flex items-center">
          {dots.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute bg-[#4FACFE] rounded-full"
              animate={isBreathing || isSyncing ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0.6 }}
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
      </div>
    </div>
  );
}

// ============ 能量球组件（精神充能模式）============
// 核心逻辑：每次生成5个球，拖拽消耗后补充到5个，循环
export function EnergyBalls({ 
  pushProgress = 0,
  onRecordAction,
}: { 
  pushProgress?: number;
  onRecordAction?: () => void;
}) {
  const BATCH_SIZE = 5;
  const [balls, setBalls] = useState<EnergyBall[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 初始化第一批5个球
  const initBalls = useCallback(() => {
    const newBalls: EnergyBall[] = [];
    for (let i = 0; i < BATCH_SIZE; i++) {
      newBalls.push({
        id: Date.now() + i,
        isConsumed: false,
        x: 15 + Math.random() * 70, // 15% - 85% 屏幕宽度
        y: 20 + Math.random() * 40,   // 20% - 60% 屏幕高度
      });
    }
    setBalls(newBalls);
  }, []);

  useEffect(() => {
    initBalls();
  }, [initBalls]);

  // 消耗球后补充到5个
  const replenishBalls = useCallback(() => {
    onRecordAction?.();
    // 延迟补充新球
    setTimeout(() => {
      setBalls(prev => {
        const consumed = prev.filter(b => !b.isConsumed).length;
        if (consumed < BATCH_SIZE) {
          const newBalls = [...prev.filter(b => !b.isConsumed)];
          const needed = BATCH_SIZE - consumed;
          for (let i = 0; i < needed; i++) {
            newBalls.push({
              id: Date.now() + i,
              isConsumed: false,
              x: 15 + Math.random() * 70,
              y: 20 + Math.random() * 40,
            });
          }
          return newBalls;
        }
        return prev.filter(b => !b.isConsumed);
      });
    }, 500);
  }, [onRecordAction]);

  // 拖拽结束处理
  const handleDragEnd = useCallback((ballId: number) => {
    setBalls(prev => prev.map(b => 
      b.id === ballId ? { ...b, isConsumed: true } : b
    ));
    replenishBalls();
  }, [replenishBalls]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 中心光晕 */}
      <div 
        className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ 
          background: `radial-gradient(circle, rgba(79, 172, 254, ${0.3 + pushProgress / 200}) 0%, transparent 70%)`,
        }}
      />

      {/* 能量球 - 使用百分比定位 */}
      {balls.filter(b => !b.isConsumed).map((ball) => (
        <motion.div
          key={ball.id}
          drag
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            // 计算相对屏幕中心的偏移
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const absoluteX = ball.x / 100 * window.innerWidth + info.offset.x;
            const absoluteY = ball.y / 100 * window.innerHeight + info.offset.y;
            const dist = Math.sqrt(
              Math.pow(absoluteX - centerX, 2) + 
              Math.pow(absoluteY - centerY, 2)
            );
            
            if (dist < 120) {
              handleDragEnd(ball.id);
            }
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute w-14 h-14 pointer-events-auto cursor-grab active:cursor-grabbing"
          style={{ 
            left: `${ball.x}%`, 
            top: `${ball.y}%`,
          }}
        >
          <div 
            className="w-full h-full rounded-full bg-gradient-to-br from-[#4FACFE]/40 to-[#4FACFE]/20 border border-[#4FACFE]/50 backdrop-blur-md"
            style={{ boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)' }}
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }} 
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 m-3 rounded-full bg-[#4FACFE]/50 blur-sm" 
            />
          </div>
        </motion.div>
      ))}
      
      {/* 提示文字 */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[#4FACFE] text-xs tracking-wider opacity-80">将思维球拖拽至中心</p>
      </div>
    </div>
  );
}

// ============ 灵感触发模式 ============
// 核心逻辑：点击后消失，随机大小重新生成新的
export function InspirationRipples({ 
  onRecordAction,
}: { 
  onRecordAction?: () => void;
}) {
  const [spots, setSpots] = useState<InspirationSpot[]>([]);
  const [ripples, setRipples] = useState<{id: number; x: number; y: number}[]>([]);

  // 初始化灵感点
  const initSpots = useCallback(() => {
    const newSpots: InspirationSpot[] = [];
    for (let i = 0; i < 6; i++) {
      newSpots.push({
        id: Date.now() + i,
        x: 15 + Math.random() * 70,
        y: 25 + Math.random() * 35,
        scale: 0.7 + Math.random() * 0.6,
      });
    }
    setSpots(newSpots);
  }, []);

  useEffect(() => {
    initSpots();
  }, [initSpots]);

  // 点击处理
  const handleSpotClick = useCallback((spotId: number, clickX: number, clickY: number) => {
    // 添加涟漪
    const rippleId = Date.now();
    setRipples(prev => [...prev, { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 2000);

    // 记录动作
    onRecordAction?.();

    // 移除点击的点
    setSpots(prev => prev.filter(s => s.id !== spotId));

    // 延迟生成新的随机点
    setTimeout(() => {
      setSpots(prev => {
        if (prev.length < 6) {
          return [...prev, {
            id: Date.now(),
            x: 15 + Math.random() * 70,
            y: 25 + Math.random() * 35,
            scale: 0.5 + Math.random() * 1,
          }];
        }
        return prev;
      });
    }, 600);
  }, [onRecordAction]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 灵感点 */}
      {spots.map((spot) => (
        <motion.div
          key={spot.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute pointer-events-auto cursor-pointer"
          style={{ 
            left: `${spot.x}%`, 
            top: `${spot.y}%`,
          }}
          onClick={(e) => handleSpotClick(spot.id, e.clientX, e.clientY)}
        >
          <div 
            className="rounded-full bg-white/20 border border-white/40 backdrop-blur-md hover:bg-white/30 hover:scale-110 transition-all"
            style={{ 
              width: `${spot.scale * 56}px`, 
              height: `${spot.scale * 56}px`,
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 m-auto mt-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{ marginTop: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </motion.div>
      ))}

      {/* 涟漪特效 */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-8 h-8 rounded-full border-2 border-white/50 pointer-events-none"
          style={{ 
            left: ripple.x - 16, 
            top: ripple.y - 16,
          }}
        />
      ))}

      {/* 提示文字 */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white/60 text-xs tracking-wider">点击漂浮的灵感点</p>
      </div>
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
          background: 'radial-gradient(circle, rgba(79, 172, 254, 0.15) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={active ? {
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        } : {}}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </div>
  );
}
