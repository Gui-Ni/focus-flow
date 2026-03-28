"use client";

import Link from "next/link";
import Logo from "@/components/LogoWrapper";

interface Product {}

// Simple placeholder - actual store coming soon

export default function StorePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#68baf4]/20 to-[#a855f7]/20 border-b border-[#68baf4]/30 py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[#68baf4]">
            🛒 商店筹备中 · 精选好物即将上线 · 敬请期待
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-bold">Focus Flow</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/app" className="text-gray-300 hover:text-white transition-colors">App</Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">专注装备精选</h1>
          <p className="text-gray-400">精选提升专注力的好物，让你的专注效率翻倍</p>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold mb-4">商店即将上线</h2>
          <p className="text-gray-400 mb-6">
            我们正在精选提升专注力的装备，敬请期待<br />
            上线后你可以在这里购买专注好物，支持联盟链接
          </p>
          <Link 
            href="/signup" 
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-[#68baf4] to-[#7fcaea] text-white font-medium hover:opacity-90 transition-opacity"
          >
            订阅更新通知
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 Focus Flow. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
