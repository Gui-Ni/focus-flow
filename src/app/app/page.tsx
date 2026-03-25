"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";

// Types
type FocusMode = "recharge" | "inspiration" | "pomodoro";
type SessionState = "idle" | "pose-confirm" | "active" | "ending";

// Recharge Mode - Drag orbs to center
function RechargeMode({ onComplete }: { onComplete: () => void }) {
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
      if (orbs.length === 1) {
        onComplete();
      }
    }, 500);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
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
        Collected: {8 - orbs.length}/8
      </div>
    </div>
  );
}

// Inspiration Mode - Tap floating points
function InspirationMode({ onComplete }: { onComplete: () => void }) {
  const [points, setPoints] = useState<
    Array<{ id: number; x: number; y: number; tapped: boolean }>
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
      tapped: false,
    }));
    setPoints(newPoints);
  };

  const tapPoint = (id: number, x: number, y: number) => {
    setTappedCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 6) {
        setTimeout(onComplete, 500);
      }
      return newCount;
    });

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
          tapped: false,
        },
      ]);
    }, 300);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute w-20 h-20 rounded-full border-2 border-purple-400"
          initial={{ x: ripple.x - 40, y: ripple.y - 40, scale: 0.5, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}

      {points.map((point) => (
        <motion.div
          key={point.id}
          className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 cursor-pointer shadow-lg shadow-purple-500/40"
          initial={{ x: point.x, y: point.y, scale: 0 }}
          animate={{
            x: point.x + Math.sin(Date.now() / 1000 + point.id) * 10,
            y: point.y + Math.cos(Date.now() / 1000 + point.id) * 10,
            scale: 1,
          }}
          transition={{ duration: 0.3 }}
          onClick={() => tapPoint(point.id, point.x, point.y)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        />
      ))}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        Inspired: {tappedCount}/6
      </div>
    </div>
  );
}

// Pomodoro Mode - Simple countdown
function PomodoroMode({ onComplete }: { onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-8xl font-bold text-white mb-8">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <div className="text-gray-400">Focus time</div>
    </div>
  );
}

// Main Dashboard
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<FocusMode>("recharge");
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [showModes, setShowModes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const startSession = (selectedMode: FocusMode) => {
    setMode(selectedMode);
    setSessionState("active");
    setShowModes(false);
  };

  const endSession = async () => {
    // Save session to database
    if (user) {
      const duration = mode === "pomodoro" ? 25 : mode === "recharge" ? 10 : 5;
      await supabase.from("focus_sessions").insert({
        user_id: user.id,
        mode: mode,
        duration_minutes: duration,
        completed_at: new Date().toISOString(),
      });
    }
    
    setSessionState("ending");
    setTimeout(() => {
      setSessionState("idle");
      setShowModes(true);
    }, 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
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
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <span className="text-sm font-bold">⚡</span>
              </div>
              <span className="font-bold">Focus Flow</span>
            </div>
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
            <Link href="/app/settings" className="text-gray-300 hover:text-white transition-colors">
              Settings
            </Link>
            <div className="flex items-center gap-3">
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
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}!
            </h1>
            <p className="text-gray-400">Choose a mode to start your session</p>
          </div>

          {/* Mode Selection */}
          <AnimatePresence>
            {showModes && (
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
                    <p className="text-gray-400 text-sm mb-4">Recharge · Focus inward</p>
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
                    <p className="text-gray-400 text-sm mb-4">Inspiration · Think divergently</p>
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
                    <p className="text-gray-400 text-sm mb-4">Classic · 25 min focus</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      Free
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Session */}
          <AnimatePresence>
            {sessionState === "active" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-40 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col"
              >
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
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModes(true)}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Exit
                  </button>
                </div>

                <div className="flex-1 relative">
                  {mode === "recharge" && <RechargeMode onComplete={endSession} />}
                  {mode === "inspiration" && <InspirationMode onComplete={endSession} />}
                  {mode === "pomodoro" && <PomodoroMode onComplete={endSession} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Session Complete */}
          <AnimatePresence>
            {sessionState === "ending" && (
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
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">✨</div>
                    <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
                    <p className="text-gray-400">Great work. Take a break.</p>
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
                      <div className="flex-1 text-left">
                        <div className="text-xs text-brand-400 mb-1">Recommended</div>
                        <div className="font-bold">Flow Journal</div>
                        <div className="text-sm text-gray-400">Track your focus journey</div>
                      </div>
                      <div className="text-brand-400">→</div>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setSessionState("idle");
                      setShowModes(true);
                    }}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium"
                  >
                    Done
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
