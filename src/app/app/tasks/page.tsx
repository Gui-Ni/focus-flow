"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        fetchTasks(session.user.id);
      }
    });
  }, [router, supabase]);

  const fetchTasks = async (userId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTasks(data);
    }
    setIsLoading(false);
  };

  const addTask = async () => {
    if (!newTask.trim() || !user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: newTask.trim(),
        priority: "medium",
      })
      .select()
      .single();

    if (!error && data) {
      setTasks([...tasks, data]);
      setNewTask("");
    }
  };

  const toggleTask = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (!error) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (!error) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const setPriority = async (task: Task, priority: "low" | "medium" | "high") => {
    const { error } = await supabase
      .from("tasks")
      .update({ priority })
      .eq("id", task.id);

    if (!error) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, priority } : t));
    }
  };

  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const priorityTask = incompleteTasks.find(t => t.priority === "high") || incompleteTasks[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/app")} className="text-gray-400 hover:text-white">
              ← Back
            </button>
            <h1 className="text-xl font-bold">Focus To-Dos</h1>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12 px-6 max-w-2xl mx-auto">
        {/* Add Task */}
        <div className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-3 rounded-xl gradient-brand font-semibold hover:opacity-90"
            >
              Add
            </button>
          </div>
        </div>

        {/* Priority Task */}
        {priorityTask && (
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">🔥 Priority</div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center gap-4"
            >
              <button
                onClick={() => toggleTask(priorityTask)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  priorityTask.completed ? "bg-green-500 border-green-500" : "border-gray-500"
                }`}
              >
                {priorityTask.completed && "✓"}
              </button>
              <span className="flex-1">{priorityTask.title}</span>
              <button
                onClick={() => deleteTask(priorityTask.id)}
                className="text-gray-400 hover:text-red-400"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}

        {/* Incomplete Tasks */}
        <div className="space-y-2 mb-8">
          {incompleteTasks.filter(t => t.id !== priorityTask?.id).map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 group"
            >
              <button
                onClick={() => toggleTask(task)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  task.completed ? "bg-green-500 border-green-500" : "border-gray-500"
                }`}
              >
                {task.completed && "✓"}
              </button>
              <span className="flex-1">{task.title}</span>
              <select
                value={task.priority}
                onChange={(e) => setPriority(task, e.target.value as "low" | "medium" | "high")}
                className="bg-transparent text-xs px-2 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Completed Tasks */}
        <AnimatePresence>
          {completedTasks.length > 0 && (
            <div>
              <div className="text-sm text-gray-400 mb-2">Completed ({completedTasks.length})</div>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4 opacity-50"
                  >
                    <button
                      onClick={() => toggleTask(task)}
                      className="w-6 h-6 rounded-full border-2 bg-green-500 border-green-500 flex items-center justify-center"
                    >
                      ✓
                    </button>
                    <span className="flex-1 line-through">{task.title}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-4">✨</div>
            <p>No tasks yet. Add one above!</p>
          </div>
        )}
      </div>
    </main>
  );
}
