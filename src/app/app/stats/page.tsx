"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface FocusSession {
  id: string;
  mode: "recharge" | "inspiration" | "pomodoro";
  duration_minutes: number;
  completed_at: string;
}

export default function StatsPage() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
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
      .limit(100);

    if (!error && data) {
      setSessions(data);
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

  const getTotalMinutes = () => {
    return getFilteredSessions().reduce((sum, s) => sum + s.duration_minutes, 0);
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
      const date = new Date(s.completed_at).toLocaleDateString("en-US", { weekday: "short" });
      stats[date] = (stats[date] || 0) + s.duration_minutes;
    });
    
    return stats;
  };

  const formatMinutes = (mins: number) => {
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      return `${hours}h ${minutes}m`;
    }
    return `${mins}m`;
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
  const totalMinutes = getTotalMinutes();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/app")} className="text-gray-400 hover:text-white">
              ← Back
            </button>
            <h1 className="text-xl font-bold">Focus Stats</h1>
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
              {p === "day" ? "Today" : p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* Total Time */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-gradient mb-2">
            {formatMinutes(totalMinutes)}
          </div>
          <div className="text-gray-400">Total Focus Time</div>
        </div>

        {/* Mode Distribution */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Mode Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/30 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-2xl font-bold">{distribution.recharge}%</div>
              <div className="text-xs text-gray-400">Recharge</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 text-center">
              <div className="text-2xl mb-1">💫</div>
              <div className="text-2xl font-bold">{distribution.inspiration}%</div>
              <div className="text-xs text-gray-400">Inspiration</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-2xl mb-1">🍅</div>
              <div className="text-2xl font-bold">{distribution.pomodoro}%</div>
              <div className="text-xs text-gray-400">Pomodoro</div>
            </div>
          </div>
        </div>

        {/* Daily Chart */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Daily Trend</h2>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-end gap-2 h-32">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                const maxMins = Math.max(...Object.values(dailyStats), 60);
                const height = dailyStats[day] ? (dailyStats[day] / maxMins) * 100 : 10;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg gradient-brand transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-400">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  {session.mode === "recharge" && "⚡"}
                  {session.mode === "inspiration" && "💫"}
                  {session.mode === "pomodoro" && "🍅"}
                </div>
                <div className="flex-1">
                  <div className="font-medium capitalize">{session.mode}</div>
                  <div className="text-sm text-gray-400">
                    {new Date(session.completed_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-lg font-bold">{session.duration_minutes}m</div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">📊</div>
            <p>No focus sessions yet.</p>
            <p className="text-sm mt-2">Complete a session to see your stats!</p>
          </div>
        )}
      </div>
    </main>
  );
}
