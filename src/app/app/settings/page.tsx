"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });
  }, [router, supabase]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-12 px-6 max-w-2xl mx-auto">
        {/* Profile Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{profile?.name || user?.email}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Subscription</h2>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Current Plan</div>
                <div className="text-sm text-gray-400">
                  {profile?.subscription_status === "pro" ? "Pro - $9/month" : "Free Plan"}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                profile?.subscription_status === "pro" 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-gray-500/20 text-gray-400"
              }`}>
                {profile?.subscription_status === "pro" ? "Active" : "Free"}
              </div>
            </div>
            
            {profile?.subscription_status !== "pro" && (
              <Link
                href="/#pricing"
                className="block w-full py-3 rounded-xl gradient-brand text-center font-semibold hover:opacity-90"
              >
                Upgrade to Pro
              </Link>
            )}
            
            {profile?.subscription_status === "pro" && (
              <a
                href="https://www.lemonsqueezy.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl border border-white/20 text-center font-medium hover:bg-white/5 transition-colors"
              >
                Manage Subscription (LemonSqueezy)
              </a>
            )}
          </div>
        </div>

        {/* Account Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Email</div>
              <div>{user?.email}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">User ID</div>
              <div className="text-sm font-mono">{user?.id}</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h2>
          <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
            <div className="mb-4">
              <div className="font-medium">Sign Out</div>
              <div className="text-sm text-gray-400">Sign out of your account on this device.</div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl border border-red-500/50 text-red-400 font-medium hover:bg-red-500/10 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="text-center text-sm text-gray-500 space-y-2">
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div>© 2026 Focus Flow. All rights reserved.</div>
        </div>
      </div>
    </main>
  );
}
