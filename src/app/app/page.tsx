"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import Logo from "@/components/LogoWrapper";
import { SyncLogo, EnergyBalls, InspirationRipples, AmbientGlow, useWhiteNoise } from "@/components/SyncEffects";

// Types
type FocusMode = "recharge" | "inspiration" | "pomodoro";
type SessionState = "idle" | "config" | "active" | "ending";
type SoundType = "none" | "brown" | "rain" | "forest" | "ocean" | "cafe";
type ThemeType = "default" | "ocean" | "forest" | "night" | "aurora";

// Theme backgrounds
const themes: Record<ThemeType, { bg: string; accent: string }> = {
  default: { bg: "from-[#1a1a2e] to-[#16213e]", accent: "#4FACFE" },
  ocean: { bg: "from-[#0a1628] to-[#1a3a5c]", accent: "#00D4FF" },
  forest: { bg: "from-[#0a1f0a] to-[#1a3a1a]", accent: "#4CAF50" },
  night: { bg: "from-[#0a0a1a] to-[#1a1a2e]", accent: "#9C27B0" },
  aurora: { bg: "from-[#1a0a2e] to-[#2e1a4a]", accent: "#E040FB" },
};

// Sound files
const sounds: Record<SoundType, string> = {
  none: "",
  brown: "https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3",
  rain: "https://assets.mixkit.co/active_storage/sfx/219/219-preview.mp3",
  forest: "https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3",
  ocean: "https://assets.mixkit.co/active_storage/sfx/2411/2411-preview.mp3",
  cafe: "https://assets.mixkit.co/active_storage/sfx/857/857-preview.mp3",
};

// Config Modal
function ConfigModal({ 
  mode, 
  onStart,
  onCancel 
}: { 
  mode: FocusMode;
  onStart: (duration: number, sound: SoundType, theme: ThemeType) => void;
  onCancel: () => void;
}) {
  const [duration, setDuration] = useState(10);
  const [sound, setSound] = useState<SoundType>("none");
  const [theme, setTheme] = useState<ThemeType>("default");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
      >
        <h2 className="text-xl font-bold mb-6 text-center">
          {mode === "recharge" && "⚡ 精神充能"}
          {mode === "inspiration" && "💫 灵感触发"}
          {mode === "pomodoro" && "🍅 番茄钟"}
        </h2>

        {/* Duration */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-3">专注时长</label>
          <div className="flex gap-3">
            {[5, 10, 15, 25].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  duration === d
                    ? "gradient-brand"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {d}min
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-3">背景音</label>
          <div className="grid grid-cols-3 gap-2">
            {(["none", "brown", "rain", "forest", "ocean", "cafe"] as SoundType[]).map((s) => (
              <button
                key={s}
                onClick={() => setSound(s)}
                className={`py-2 rounded-lg text-sm transition-all ${
                  sound === s
                    ? "bg-brand-500/30 border border-brand-500"
                    : "bg-white/5 hover:bg-white/10 border border-transparent"
                }`}
              >
                {s === "none" && "静音"}
                {s === "brown" && "白噪音"}
                {s === "rain" && "雨声"}
                {s === "forest" && "森林"}
                {s === "ocean" && "海浪"}
                {s === "cafe" && "咖啡厅"}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-3">背景主题</label>
          <div className="flex gap-3">
            {(Object.keys(themes) as ThemeType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`w-12 h-12 rounded-xl transition-all ${
                  theme === t ? "ring-2 ring-white" : ""
                } bg-gradient-to-br ${themes[t].bg}`}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onStart(duration, sound, theme)}
            className="flex-1 py-3 rounded-xl gradient-brand font-semibold hover:opacity-90 transition-opacity"
          >
            开始专注
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Recharge Mode - Drag orbs to center
function RechargeMode({ sessionDuration }: { sessionDuration: number }) {
  const [orbs, setOrbs] = useState<
    Array<{ id: number; x: number; y: number; collected: boolean }>
  >([]);
  const [centerGlow, setCenterGlow] = useState(0);

  useEffect(() => {
    const newOrbs = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 280 - 140,
      y: Math.random() * 280 - 140,
      collected: false,
    }));
    setOrbs(newOrbs);
  }, []);

  const collectOrb = (id: number) => {
    setOrbs((prev) =>
      prev.map((orb) => (orb.id === id ? { ...orb, collected: true } : orb))
    );
    setCenterGlow((prev) => Math.min(prev + 12.5, 100));

    setTimeout(() => {
      setOrbs((prev) => prev.filter((orb) => orb.id !== id));
    }, 500);
  };

  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Timer */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl font-bold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-brand-400 to-brand-600"
        animate={{
          scale: 1 + centerGlow * 0.01,
          opacity: 0.3 + centerGlow * 0.005,
        }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute w-6 h-6 rounded-full bg-white shadow-lg shadow-brand-500/50" />

      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 cursor-grab active:cursor-grabbing shadow-lg shadow-brand-500/30"
          initial={{ x: orb.x, y: orb.y }}
          animate={{
            x: orb.collected ? 0 : orb.x,
            y: orb.collected ? 0 : orb.y,
            scale: orb.collected ? 0 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.18, 1, 0.32, 1] }}
          onClick={() => !orb.collected && collectOrb(orb.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ touchAction: "none" }}
        />
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        已收集: {8 - orbs.length}/8
      </div>
    </div>
  );
}

// Inspiration Mode - Tap floating points
function InspirationMode({ sessionDuration }: { sessionDuration: number }) {
  const [points, setPoints] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [tappedCount, setTappedCount] = useState(0);

  useEffect(() => {
    generatePoints();
  }, []);

  const generatePoints = () => {
    const newPoints = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setPoints(newPoints);
  };

  const tapPoint = (id: number, x: number, y: number) => {
    setTappedCount((prev) => prev + 1);

    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1000);

    setPoints((prev) => prev.filter((p) => p.id !== id));
    setTimeout(() => {
      setPoints((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
        },
      ]);
    }, 300);
  };

  const minutes = Math.floor(sessionDuration / 60);
  const seconds = sessionDuration % 60;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Timer */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl font-bold">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      {/* Ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute w-20 h-20 rounded-full border-2 border-purple-400"
          initial={{ x: ripple.x - 40, y: ripple.y - 40, scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {/* Points */}
      {points.map((point) => (
        <motion.div
          key={point.id}
          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 cursor-pointer shadow-lg shadow-purple-500/40"
          animate={{
            x: point.x + Math.sin(Date.now() / 1000 + point.id) * 10,
            y: point.y + Math.cos(Date.now() / 1000 + point.id) * 10,
          }}
          onClick={() => tapPoint(point.id, point.x, point.y)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        />
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        已触发: {tappedCount} 个灵感点
      </div>
    </div>
  );
}

// Pomodoro Mode - Simple countdown
function PomodoroMode({ timeLeft }: { timeLeft: number }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-8xl font-bold text-white mb-8">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="text-gray-400">专注时间</div>
    </div>
  );
}

// Inspiration Notes Component
function InspirationNotes({ onSave }: { onSave: (note: string) => void }) {
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 w-72 bg-[#1a1a2e] rounded-xl p-4 border border-white/10"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="记录你的灵感..."
              className="w-full h-24 bg-white/5 rounded-lg p-3 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  if (note.trim()) {
                    onSave(note);
                    setNote("");
                  }
                }}
                className="flex-1 py-2 rounded-lg gradient-brand text-sm font-medium"
              >
                保存
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-sm"
              >
                关闭
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
      >
        📝
      </button>
    </div>
  );
}

// Fullscreen Button
function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-brand shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
      title={isFullscreen ? "退出全屏" : "全屏"}
    >
      {isFullscreen ? "⊠" : "⛶"}
    </button>
  );
}

// Session Complete Modal
function SessionCompleteModal({ 
  mode, 
  actualDuration, 
  inspirations,
  onClose 
}: { 
  mode: FocusMode;
  actualDuration: number;
  inspirations: string[];
  onClose: () => void;
}) {
  const focusScore = Math.min(100, Math.floor(actualDuration / 60 * 4 + inspirations.length * 10));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full"
      >
        {/* Data Card */}
        <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/10 mb-4">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2">专注完成！</h2>
            <p className="text-gray-400">Great work. Take a break.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold text-brand-400">{Math.floor(actualDuration / 60)}分{actualDuration % 60}秒</div>
              <div className="text-xs text-gray-400">实际时长</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold text-green-400">{focusScore}</div>
              <div className="text-xs text-gray-400">专注分</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/5">
              <div className="text-2xl font-bold text-purple-400">{inspirations.length}</div>
              <div className="text-xs text-gray-400">灵感数</div>
            </div>
          </div>

          {/* Inspirations */}
          {inspirations.length > 0 && (
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-2">💡 灵感记录</div>
              <div className="space-y-2">
                {inspirations.map((ins, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/5 text-sm">
                    {ins}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Recommendation */}
        <Link
          href="/store"
          className="block p-4 rounded-xl bg-gradient-to-r from-brand-500/20 to-purple-500/20 border border-brand-500/30 hover:border-brand-500/50 transition-colors mb-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl">
              📓
            </div>
            <div className="flex-1">
              <div className="text-xs text-brand-400 mb-1">为你推荐</div>
              <div className="font-bold">Flow Journal</div>
              <div className="text-sm text-gray-400">记录专注轨迹，激发更多灵感</div>
            </div>
            <div className="text-brand-400 text-xl">→</div>
          </div>
        </Link>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium"
        >
          完成
        </button>
      </motion.div>
    </motion.div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [mode, setMode] = useState<FocusMode>("recharge");
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedSound, setSelectedSound] = useState<SoundType>("none");
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>("default");
  const [inspirations, setInspirations] = useState<string[]>([]);
  
  // Session timing
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [sessionElapsed, setSessionElapsed] = useState<number>(0);
  const [pomodoroTimeLeft, setPomodoroTimeLeft] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Guest mode - allow access without login
        setIsGuest(true);
        setIsLoading(false);
      } else {
        setUser(session.user);
        setIsGuest(false);
        setIsLoading(false);
      }
    });
  }, [router, supabase]);

  const handleSignOut = async () => {
    if (user) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  const startSession = (selectedMode: FocusMode) => {
    setMode(selectedMode);
    setSessionState("config");
  };

  const beginSession = async (duration: number, sound: SoundType, theme: ThemeType) => {
    setSelectedDuration(duration);
    setSelectedSound(sound);
    setSelectedTheme(theme);
    setSessionState("active");
    setInspirations([]);
    
    // Record start time
    const now = Date.now();
    setSessionStartTime(now);
    setSessionElapsed(0);
    setPomodoroTimeLeft(duration * 60);

    // Start timer
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - now) / 1000);
      setSessionElapsed(elapsed);
      
      if (mode === "pomodoro") {
        setPomodoroTimeLeft(prev => {
          if (prev <= 1) {
            endSession();
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Recharge/Inspiration mode ends when duration reached
        if (elapsed >= duration * 60) {
          endSession();
        }
      }
    }, 1000);

    // Play sound if selected
    if (sound !== "none" && sounds[sound]) {
      audioRef.current = new Audio(sounds[sound]);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(console.error);
    }
  };

  const endSession = async () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop sound
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Calculate actual duration
    const actualDuration = Math.floor((Date.now() - sessionStartTime) / 1000);

    // Only save to database if user is logged in (not guest)
    if (user && actualDuration > 0) {
      await supabase.from("focus_sessions").insert({
        user_id: user.id,
        mode: mode,
        duration_minutes: Math.floor(actualDuration / 60),
        duration_seconds: actualDuration,
        inspirations: inspirations.length > 0 ? inspirations : null,
        completed_at: new Date().toISOString(),
      });
    }

    setSessionState("ending");
  };

  const closeSession = () => {
    setSessionState("idle");
  };

  const saveInspiration = (note: string) => {
    setInspirations((prev) => [...prev, note]);
  };

  const bgClass = themes[selectedTheme].bg;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <main className={`min-h-screen bg-gradient-to-br ${bgClass} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">⚡</span>
          </div>
          <div className="text-white">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-gradient-to-br ${bgClass} text-white`}>
      {/* Audio */}
      <audio ref={audioRef} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="flex items-center gap-2">
              <Logo size="sm" animate={false} />
              <span className="font-bold">Focus Flow</span>
            </Link>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/app/tasks" className="text-gray-300 hover:text-white transition-colors">
              Tasks
            </Link>
            <Link href="/app/stats" className="text-gray-300 hover:text-white transition-colors">
              Stats
            </Link>
            <Link href="/store" className="text-gray-300 hover:text-white transition-colors">
              Store
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
            {user && (
              <Link href="/app/settings" className="text-gray-300 hover:text-white transition-colors">
                Settings
              </Link>
            )}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-[#68baf4] to-[#7fcaea] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  登录保存进度
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isGuest ? "欢迎体验 Focus Flow" : `Welcome back${user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}!`}
            </h1>
            <p className="text-gray-400">选择一个模式开始专注</p>
            {isGuest && (
              <p className="text-sm text-[#68baf4] mt-2">游客模式 · 专注数据不会被保存</p>
            )}
          </div>

          {/* Mode Selection */}
          <AnimatePresence>
            {sessionState === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Recharge Mode */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startSession("recharge")}
                    className="p-8 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/30 hover:border-brand-500/50 transition-all text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl gradient-brand flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <h3 className="text-xl font-bold mb-2">精神充能</h3>
                    <p className="text-gray-400 text-sm mb-4">向内收集，收束聚焦</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      Free
                    </span>
                  </motion.button>

                  {/* Inspiration Mode */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startSession("inspiration")}
                    className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      💫
                    </div>
                    <h3 className="text-xl font-bold mb-2">灵感触发</h3>
                    <p className="text-gray-400 text-sm mb-4">向外扩散，跳跃触发</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                      Pro
                    </span>
                  </motion.button>

                  {/* Pomodoro Mode */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => startSession("pomodoro")}
                    className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      🍅
                    </div>
                    <h3 className="text-xl font-bold mb-2">番茄钟</h3>
                    <p className="text-gray-400 text-sm mb-4">经典专注，25分钟</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      Free
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Config Modal */}
      <AnimatePresence>
        {sessionState === "config" && (
          <ConfigModal
            mode={mode}
            onStart={beginSession}
            onCancel={() => setSessionState("idle")}
          />
        )}
      </AnimatePresence>

      {/* Active Session */}
      <AnimatePresence>
        {sessionState === "active" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col"
          >
            {/* Sound Toggle */}
            {selectedSound !== "none" && (
              <div className="absolute top-20 right-20 z-50">
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      if (audioRef.current.paused) {
                        audioRef.current.play();
                      } else {
                        audioRef.current.pause();
                      }
                    }
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  🔊
                </button>
              </div>
            )}

            {/* Fullscreen Button - Bottom Left */}
            <FullscreenButton />

            {/* SYNC 视觉特效 */}
            <AmbientGlow active={true} color={selectedTheme === "ocean" ? "#00D4FF" : "#4FACFE"} />
            
            {/* 能量球 - 精神充能模式 */}
            {mode === "recharge" && (
              <EnergyBalls ballCount={8} />
            )}
            
            {/* 灵感涟漪 - 灵感触发模式 */}
            {mode === "inspiration" && (
              <InspirationRipples active={true} rippleCount={10} />
            )}

            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  {mode === "recharge" && "⚡"}
                  {mode === "inspiration" && "💫"}
                  {mode === "pomodoro" && "🍅"}
                </div>
                <div>
                  <h2 className="font-bold">
                    {mode === "recharge" && "精神充能 · Recharge"}
                    {mode === "inspiration" && "灵感触发 · Inspiration"}
                    {mode === "pomodoro" && "番茄钟 · Pomodoro"}
                  </h2>
                  <div className="text-sm text-gray-400">预设 {selectedDuration} 分钟</div>
                </div>
              </div>
              <button
                onClick={endSession}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                结束
              </button>
            </div>

            <div className="flex-1 relative">
              {mode === "recharge" && <RechargeMode sessionDuration={sessionElapsed} />}
              {mode === "inspiration" && <InspirationMode sessionDuration={sessionElapsed} />}
              {mode === "pomodoro" && <PomodoroMode timeLeft={pomodoroTimeLeft} />}
            </div>

            {/* Inspiration Notes */}
            <InspirationNotes onSave={saveInspiration} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Complete */}
      <AnimatePresence>
        {sessionState === "ending" && (
          <SessionCompleteModal
            mode={mode}
            actualDuration={Math.floor(sessionElapsed / 60)}
            inspirations={inspirations}
            onClose={closeSession}
          />
        )}
      </AnimatePresence>
    </main>
  );
}