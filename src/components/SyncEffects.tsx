/**
 * 毕设 SYNC·心跃 视觉特效组件
 * 提取自 CabinApp.tsx，适配 Focus Flow
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// ============ SYNC Logo 组件 ============
export function SyncLogo({ 
  size = 160, 
  isBreathing = true,
  className = ""
}: { 
  size?: number; 
  isBreathing?: boolean;
  className?: string;
}) {
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
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size * 1.5, height: size }}
    >
      {/* 主光球 */}
      <motion.div
        animate={isBreathing ? { 
          scale: [1, 0.95, 1], 
          opacity: [0.9, 0.7, 0.9] 
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #4FACFE 0%, rgba(255,255,255,0.9) 100%)',
          boxShadow: '0 0 60px rgba(79, 172, 254, 0.4)',
        }}
      />
      
      {/* 内层光晕 */}
      <motion.div
        animate={isBreathing ? { 
          scale: [1, 0.9, 1], 
          opacity: [0.8, 0.6, 0.8] 
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          width: size * 0.75,
          height: size * 0.75,
          background: 'linear-gradient(135deg, #4FACFE 0%, rgba(255,255,255,0.9) 100%)',
          opacity: 0.6,
        }}
      />
      
      {/* 弧形点 */}
      <div className="relative h-full ml-4 flex items-center">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#4FACFE] rounded-full"
            animate={isBreathing ? { opacity: [0.4, 0.9, 0.4] } : {}}
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
  );
}

// ============ 能量球组件（精神充能模式） ============
export function EnergyBalls({ 
  onBallConsumed,
  ballCount = 8 
}: { 
  onBallConsumed?: (id: number) => void;
  ballCount?: number;
}) {
  const [balls, setBalls] = useState<EnergyBall[]>([]);
  const [draggedBall, setDraggedBall] = useState<number | null>(null);

  // 初始化能量球
  const initBalls = useCallback(() => {
    const newBalls: EnergyBall[] = [];
    for (let i = 0; i < ballCount; i++) {
      newBalls.push({
        id: Date.now() + i,
        isConsumed: false,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.5 + 100 : 300),
        size: 40 + Math.random() * 40,
      });
    }
    setBalls(newBalls);
  }, [ballCount]);

  useEffect(() => {
    initBalls();
  }, [initBalls]);

  // 拖拽处理
  const handleMouseDown = (id: number) => {
    setDraggedBall(id);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedBall === null) return;
    
    setBalls(prev => prev.map(ball => 
      ball.id === draggedBall 
        ? { ...ball, x: e.clientX, y: e.clientY }
        : ball
    ));
  }, [draggedBall]);

  const handleMouseUp = useCallback(() => {
    if (draggedBall === null) return;
    
    // 检查是否在中心区域
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;
    
    const draggedBallData = balls.find(b => b.id === draggedBall);
    if (draggedBallData) {
      const distance = Math.sqrt(
        Math.pow(draggedBallData.x - centerX, 2) + 
        Math.pow(draggedBallData.y - centerY, 2)
      );
      
      // 如果拖拽到中心，消耗能量球
      if (distance < 150) {
        setBalls(prev => prev.map(b => 
          b.id === draggedBall ? { ...b, isConsumed: true } : b
        ));
        onBallConsumed?.(draggedBall);
        
        // 动画后移除
        setTimeout(() => {
          setBalls(prev => prev.filter(b => b.id !== draggedBall));
        }, 500);
      }
    }
    
    setDraggedBall(null);
  }, [draggedBall, balls, onBallConsumed]);

  useEffect(() => {
    if (draggedBall !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedBall, handleMouseMove, handleMouseUp]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {balls.map((ball) => (
        <motion.div
          key={ball.id}
          className={`absolute rounded-full cursor-pointer pointer-events-auto ${ball.isConsumed ? 'opacity-0' : ''}`}
          style={{
            left: ball.x,
            top: ball.y,
            width: ball.size,
            height: ball.size,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle at 30% 30%, #4FACFE, #00F2FE)',
            boxShadow: '0 0 30px rgba(79, 172, 254, 0.6)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: ball.isConsumed ? 0 : [1, 1.1, 1],
            opacity: ball.isConsumed ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
          onMouseDown={() => handleMouseDown(ball.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      ))}
    </div>
  );
}

// ============ 灵感涟漪组件（灵感触发模式） ============
export function InspirationRipples({ 
  active = true,
  rippleCount = 10 
}: { 
  active?: boolean;
  rippleCount?: number;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setRipples(prev => {
        if (prev.length > rippleCount) return prev.slice(1);
        return [...prev, {
          id: Date.now(),
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.5 + 100 : 300),
        }];
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, [active, rippleCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full border border-cyan-400/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 50,
              height: 50,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      
      {/* 灵感卡片浮动效果 */}
      {ripples.slice(0, 3).map((ripple, i) => (
        <motion.div
          key={`card-${ripple.id}`}
          className="absolute w-20 h-28 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg border border-purple-400/30 flex items-center justify-center text-2xl"
          style={{
            left: ripple.x + (i - 1) * 40,
            top: ripple.y - 60,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      ))}
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
    <div className="absolute inset-0 overflow-hidden">
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

// ============ 白噪音 Hook ============
export function useWhiteNoise(isPlaying: boolean, volume = 0.15) {
  useEffect(() => {
    if (!isPlaying) return;
    
    let audioCtx: AudioContext | null = null;
    let gainNode: GainNode | null = null;
    let noiseSource: AudioBufferSourceNode | null = null;
    
    try {
      // @ts-ignore
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      // 创建粉红噪音
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
      
      noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      
      // 低通滤波器
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 3);
      
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      noiseSource.start();
    } catch (e) {
      console.error("Audio failed", e);
    }
    
    return () => {
      if (gainNode && audioCtx) {
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
        setTimeout(() => {
          if (noiseSource) noiseSource.stop();
          if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
        }, 1500);
      }
    };
  }, [isPlaying, volume]);
}
