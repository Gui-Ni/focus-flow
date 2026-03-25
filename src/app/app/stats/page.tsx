"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface FocusSession {
  id: string;
  mode: "recharge" | "inspiration" | "pomodoro";
  duration_minutes: number;
  duration_seconds?: number;
  inspirations?: string[];
  completed_at: string;
}

export default function StatsPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        fetchSessions(session.user.id);
      }
    });
  }, [router, supabase]);

  const fetchSessions = async (userId: string) => {
    const { data, error } = await supabase
      .from("focus_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(200);

    if (!error && data) {
      // Convert duration_seconds to actual seconds stored
      const sessionsWithSeconds = data.map(s => ({
        ...s,
        duration_seconds: s.duration_seconds || s.duration_minutes * 60
      }));
      setSessions(sessionsWithSeconds);
    }
    setIsLoading(false);
  };

  const getFilteredSessions = () => {
    const now = new Date();
    const filtered = sessions.filter(s => {
      const date = new Date(s.completed_at);
      if (period === "day") {
        return date.toDateString() === now.toDateString();
      } else if (period === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo;
      } else {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo;
      }
    });
    return filtered;
  };

  const getTotalSeconds = () => {
    return getFilteredSessions().reduce((sum, s) => sum + (s.duration_seconds || s.duration_minutes * 60), 0);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getModeDistribution = () => {
    const filtered = getFilteredSessions();
    const total = filtered.length;
    const modes = {
      recharge: filtered.filter(s => s.mode === "recharge").length,
      inspiration: filtered.filter(s => s.mode === "inspiration").length,
      pomodoro: filtered.filter(s => s.mode === "pomodoro").length,
    };
    return {
      recharge: total > 0 ? Math.round((modes.recharge / total) * 100) : 0,
      inspiration: total > 0 ? Math.round((modes.inspiration / total) * 100) : 0,
      pomodoro: total > 0 ? Math.round((modes.pomodoro / total) * 100) : 0,
    };
  };

  const getDailyStats = () => {
    const filtered = getFilteredSessions();
    const stats: Record<string, number> = {};
    
    filtered.forEach(s => {
      const date = new Date(s.completed_at);
      const dayKey = date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
      const seconds = s.duration_seconds || s.duration_minutes * 60;
      stats[dayKey] = (stats[dayKey] || 0) + seconds;
    });
    
    return stats;
  };

  const getTotalInspirations = () => {
    return getFilteredSessions().reduce((sum, s) => sum + (s.inspirations?.length || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">⚡</span>
          </div>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  const distribution = getModeDistribution();
  const dailyStats = getDailyStats();
  const totalSeconds = getTotalSeconds();
  const totalInspirations = getTotalInspirations();
  const filteredSessions = getFilteredSessions();

  // Get last 7 days for chart (from Monday to Sunday)
  const getLast7Days = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
    });
  };
  const last7Days = getLast7Days();

  const maxSeconds = Math.max(...Object.values(dailyStats), 1);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/app")} className="text-gray-400 hover:text-white">
              ← Back
            </button>
            <h1 className="text-xl font-bold">专注统计</h1>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12 px-6 max-w-2xl mx-auto">
        {/* Period Selector */}
        <div className="flex gap-2 mb-8">
          {(["day", "week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "gradient-brand"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {p === "day" ? "今日" : p === "week" ? "本周" : "本月"}
            </button>
          ))}
        </div>

        {/* Total Time */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gradient mb-2">
            {formatTime(totalSeconds)}
          </div>
          <div className="text-gray-400">总专注时长</div>
        </div>

        {/* Mode Distribution */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">模式分布</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/30 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-2xl font-bold">{distribution.recharge}%</div>
              <div className="text-xs text-gray-400">精神充能</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 text-center">
              <div className="text-2xl mb-1">💫</div>
              <div className="text-2xl font-bold">{distribution.inspiration}%</div>
              <div className="text-xs text-gray-400">灵感触发</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl mb-1">🍅</div>
              <div className="text-2xl font-bold">{distribution.pomodoro}%</div>
              <div className="text-xs text-gray-400">番茄钟</div>
            </div>
          </div>
        </div>

        {/* Daily Chart */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">每日趋势</h2>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-end gap-2 h-32">
              {last7Days.map((day) => {
                const seconds = dailyStats[day] || 0;
                const height = seconds > 0 ? Math.max((seconds / maxSeconds) * 100, 5) : 5;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg gradient-brand transition-all"
                      style={{ height: `${height}%` }}
                      title={seconds > 0 ? formatTime(seconds) : "无数据"}
                    />
                    <div className="text-xs text-gray-400">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Inspirations Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">💡 灵感记录</h2>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-purple-400">{totalInspirations}</div>
              <div className="text-sm text-gray-400">条灵感记录</div>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">最近记录</h2>
          <div className="space-y-2">
            {filteredSessions.slice(0, 10).map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    {session.mode === "recharge" && "⚡"}
                    {session.mode === "inspiration" && "💫"}
                    {session.mode === "pomodoro" && "🍅"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      {session.mode === "recharge" && "精神充能"}
                      {session.mode === "inspiration" && "灵感触发"}
                      {session.mode === "pomodoro" && "番茄钟"}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(session.completed_at).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatTime(session.duration_seconds || session.duration_minutes * 60)}
                    </div>
                    {session.inspirations && session.inspirations.length > 0 && (
                      <div className="text-xs text-purple-400 flex items-center gap-1 justify-end">
                        <span>💡</span>
                        <span>{session.inspirations.length}条灵感</span>
                        <span>→</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Detail Modal */}
        <AnimatePresence>
          {selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
              onClick={() => setSelectedSession(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-md w-full bg-[#1a1a2e] rounded-2xl p-6 border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {selectedSession.mode === "recharge" && "⚡ 精神充能"}
                    {selectedSession.mode === "inspiration" && "💫 灵感触发"}
                    {selectedSession.mode === "pomodoro" && "🍅 番茄钟"}
                  </h2>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-1">完成时间</div>
                  <div>{new Date(selectedSession.completed_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</div>
                </div>

                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-1">专注时长</div>
                  <div className="text-2xl font-bold">
                    {formatTime(selectedSession.duration_seconds || selectedSession.duration_minutes * 60)}
                  </div>
                </div>

                {selectedSession.inspirations && selectedSession.inspirations.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">💡 灵感记录</div>
                    <div className="space-y-2">
                      {selectedSession.inspirations.map((ins, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/5">
                          <div className="text-xs text-gray-500 mb-1">灵感 {i + 1}</div>
                          <div>{ins}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!selectedSession.inspirations || selectedSession.inspirations.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">💭</div>
                    <div>本次专注没有记录灵感</div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">📊</div>
            <p>暂无专注记录</p>
            <p className="text-sm mt-2">完成一次专注后来看看你的数据吧！</p>
          </div>
        )}
      </div>
    </main>
  );
}
