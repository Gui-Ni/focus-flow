import Link from "next/link";
import Logo from "@/components/LogoWrapper";
import { BrandName } from "@/components/LogoWrapper";
import ImmersiveBackground from "@/components/ImmersiveBackground";
import SubscribeButton from "@/components/SubscribeButton";
import { FadeIn, HoverScale, HoverScaleInner, Pulse, PulseDot } from "@/components/AnimatedWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      <ImmersiveBackground />

      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" animate={false} />
            <BrandName size="lg" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link href="/store" className="text-gray-300 hover:text-white transition-colors">Store</Link>
            <Link href="/app" className="text-gray-300 hover:text-white transition-colors">App</Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/signup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#68baf4] to-[#7fcaea] text-white font-medium hover:opacity-90 transition-opacity">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Pulse className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <PulseDot />
            <span className="text-sm text-gray-300">Now in Beta</span>
          </Pulse>

          <div className="mb-8 flex justify-center">
            <Logo size="xl" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Enter Your
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#68baf4] via-[#7fcaea] to-[#eaf4fd]">
              Flow State
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            A productivity dashboard with immersive interaction modes designed to help you achieve deep focus.
            Not just a timer — an experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app" className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#68baf4] to-[#7fcaea] text-lg font-semibold hover:opacity-90 transition-all hover:scale-105">
              Start for Free →
            </Link>
            <Link href="#features" className="px-8 py-4 rounded-xl border border-white/20 text-lg font-medium hover:bg-white/5 transition-all">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#68baf4]/10">
            <div className="bg-[#111] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-gray-500 text-sm">app.focusflow.com</div>
            </div>
            <Link href="/app" className="block bg-gradient-to-br from-[#0a0a1a] to-[#0a1a2a] aspect-video flex items-center justify-center relative overflow-hidden hover:from-[#0a1a2a] hover:to-[#0a2a3a] transition-all cursor-pointer">
              <div className="absolute w-64 h-64 rounded-full bg-[#68baf4]/20 blur-3xl animate-pulse" />
              <div className="text-center relative z-10">
                <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#68baf4] to-[#7fcaea] mb-4">25:00</div>
                <div className="text-gray-400 mb-8">Focus Mode · Recharge</div>
                <div className="flex justify-center gap-4">
                  {["⚡", "💫", "🍅"].map((emoji, i) => (
                    <div key={emoji} className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${i === 0 ? "bg-gradient-to-br from-[#68baf4]/30 to-[#7fcaea]/10 border border-[#68baf4]/50" : "bg-white/5 border border-white/20"}`}>
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-[#68baf4] font-medium">👉 Click to Try Now</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interaction Modes</h2>
            <p className="text-gray-400 text-lg">Choose your path to flow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <HoverScale className="p-8 rounded-2xl bg-gradient-to-br from-[#68baf4]/20 to-transparent border border-[#68baf4]/30 hover:border-[#68baf4]/50 transition-all group">
              <HoverScaleInner className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#68baf4] to-[#7fcaea] flex items-center justify-center text-2xl mb-6 group-hover:shadow-lg group-hover:shadow-[#68baf4]/30">
                ⚡
              </HoverScaleInner>
              <h3 className="text-2xl font-bold mb-3">精神充能 Recharge</h3>
              <p className="text-gray-400 mb-4">向内收集，收束聚焦。Drag energy orbs to center, shrinking them into a focused point of light. A meditative experience.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-[#68baf4]/20 text-[#68baf4]">Free</span>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300">Focus</span>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300">Meditation</span>
              </div>
            </HoverScale>

            <HoverScale className="p-8 rounded-2xl bg-gradient-to-br from-[#a855f7]/20 to-transparent border border-[#a855f7]/30 hover:border-[#a855f7]/50 transition-all group">
              <HoverScaleInner className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-2xl mb-6 group-hover:shadow-lg group-hover:shadow-[#a855f7]/30">
                💫
              </HoverScaleInner>
              <h3 className="text-2xl font-bold mb-3">灵感触发 Inspiration</h3>
              <p className="text-gray-400 mb-4">向外扩散，跳跃触发。Tap floating inspiration points that ripple outward, activating divergent thinking for creative breakthroughs.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-[#a855f7]/20 text-[#a855f7]">Pro</span>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300">Creative</span>
                <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300">Breakthrough</span>
              </div>
            </HoverScale>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {[
              { emoji: "🌍", title: "Beautiful Themes", desc: "Transport yourself to dream destinations" },
              { emoji: "🔊", title: "Ambient Sounds", desc: "Layer calming soundscapes" },
              { emoji: "📊", title: "Focus Stats", desc: "Track your productivity trends" },
              { emoji: "✨", title: "Smart To-Dos", desc: "One priority at a time" },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1} className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h4 className="font-semibold mb-2">{f.title}</h4>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">Start free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-8 bg-white/5 border border-white/10">
              <div className="text-gray-400 mb-2">Free</div>
              <div className="text-4xl font-bold mb-1">$0</div>
              <div className="text-gray-500 mb-8">forever</div>
              <ul className="space-y-4 mb-8">
                {["精神充能模式", "Basic themes", "5 ambient sounds", "Basic stats"].map(item => (
                  <li key={item} className="flex items-center gap-3"><span className="text-green-400">✓</span>{item}</li>
                ))}
                {["灵感触发模式", "Premium themes"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-500"><span>✗</span>{item}</li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3 rounded-xl border border-white/20 text-center font-medium hover:bg-white/5 transition-colors">Get Started</Link>
            </div>

            <div className="rounded-2xl p-8 bg-gradient-to-b from-[#68baf4]/20 to-transparent border border-[#68baf4]/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#68baf4] to-[#7fcaea] text-sm font-medium">Recommended</div>
              <div className="text-[#68baf4] mb-2">Pro</div>
              <div className="text-4xl font-bold mb-1">$9</div>
              <div className="text-gray-500 mb-8">/ month</div>
              <ul className="space-y-4 mb-8">
                {["Everything in Free", "灵感触发模式", "All premium themes", "Unlimited ambient sounds", "Advanced analytics", "Cloud sync"].map(item => (
                  <li key={item} className="flex items-center gap-3"><span className="text-green-400">✓</span>{item}</li>
                ))}
              </ul>
              <SubscribeButton mode="subscribe" />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-gray-400 text-sm">Your flow state companion. Achieve more with immersive interaction modes.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/store" className="hover:text-white transition-colors">Store</Link></li>
                <li><Link href="/app" className="hover:text-white transition-colors">App</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-500 text-sm">© 2026 Focus Flow. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
