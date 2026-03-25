"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: number;
  name: string;
  name_en: string;
  description: string;
  price: number;
  image: string;
  category: string;
  affiliate_link: string;
  tags: string[]; // "recharge", "inspiration", "pomodoro"
  scenario: string; // "专注时配这个效果更好"
}

// Demo products with affiliate links
const products: Product[] = [
  {
    id: 1,
    name: "Flow Journal",
    name_en: "Focus Planner",
    description: "120页专注规划本，引导你记录每次专注的目标、心得与灵感。配合番茄工作法使用效果更佳。",
    price: 89,
    image: "📓",
    category: "文具",
    affiliate_link: "https://s.click.taobao.com/xxxxx", // 替换为你的联盟链接
    tags: ["recharge", "inspiration", "pomodoro"],
    scenario: "记录专注轨迹，激发更多灵感"
  },
  {
    id: 2,
    name: "降噪耳机",
    name_en: "Noise-Cancelling Headphones",
    description: "沉浸式降噪，让你更专注于当下。配合白噪音使用，隔绝外界干扰。",
    price: 1299,
    image: "🎧",
    category: "数码",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["recharge", "pomodoro"],
    scenario: "隔绝噪音，深度沉浸"
  },
  {
    id: 3,
    name: "桌面氛围灯",
    name_en: "Ambient Desk Light",
    description: "可调色温的桌面灯，暖光模式配合专注，光线柔和不伤眼。",
    price: 159,
    image: "💡",
    category: "家居",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["recharge", "inspiration"],
    scenario: "营造专注氛围，提升专注力"
  },
  {
    id: 4,
    name: "人体工学椅垫",
    name_en: "Ergonomic Seat Cushion",
    description: "记忆棉材质，久坐不累。配合番茄钟使用，保持舒适坐姿。",
    price: 89,
    image: "🪑",
    category: "家居",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["pomodoro"],
    scenario: "久坐舒适，保持专注"
  },
  {
    id: 5,
    name: "白噪音机",
    name_en: "White Noise Machine",
    description: "多种自然音效：雨声、海浪、森林。专注时播放，提升注意力。",
    price: 299,
    image: "🔊",
    category: "数码",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["recharge", "pomodoro"],
    scenario: "白噪音屏蔽干扰，提升专注"
  },
  {
    id: 6,
    name: "灵感画册",
    name_en: "Creative Sketchbook",
    description: "A4大开本，画质细腻，适合记录灵感草图和思维导图。",
    price: 45,
    image: "🎨",
    category: "文具",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["inspiration"],
    scenario: "捕捉灵感，一笔成画"
  },
  {
    id: 7,
    name: "静心香薰",
    name_en: "Aromatherapy Diffuser",
    description: "薰衣草+檀香组合，舒缓放松。配合精神充能模式使用。",
    price: 69,
    image: "🕯️",
    category: "家居",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["recharge"],
    scenario: "芬芳缭绕，心静自然专注"
  },
  {
    id: 8,
    name: "计时沙漏",
    name_en: "Sand Timer",
    description: "5分钟/15分钟可选，视觉化时间流逝。配合番茄钟使用。",
    price: 35,
    image: "⏳",
    category: "文具",
    affiliate_link: "https://s.click.taobao.com/xxxxx",
    tags: ["pomodoro"],
    scenario: "可视化时间，增强紧迫感"
  },
];

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [lastMode, setLastMode] = useState<string | null>(null);
  const [recommendedForYou, setRecommendedForYou] = useState<Product[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 获取用户最近使用的模式
    const fetchLastMode = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: sessions } = await supabase
          .from("focus_sessions")
          .select("mode")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false })
          .limit(1);
        
        if (sessions && sessions.length > 0) {
          const mode = sessions[0].mode;
          setLastMode(mode);
          
          // 根据模式推荐商品
          const recommended = products.filter(p => p.tags.includes(mode)).slice(0, 3);
          setRecommendedForYou(recommended);
        }
      }
    };
    
    fetchLastMode();
  }, [supabase]);

  const categories = ["全部", "文具", "数码", "家居"];
  
  const filteredProducts = selectedCategory === "全部" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-sm font-bold">⚡</span>
            </div>
            <span className="font-bold">Focus Flow</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/app" className="text-gray-300 hover:text-white transition-colors">
              App
            </Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">专注装备精选</h1>
          <p className="text-xl text-gray-400">
            精选提升专注力的好物，让你的专注效率翻倍
          </p>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Recommended Section */}
          {lastMode && recommendedForYou.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl font-bold">
                  为你推荐（基于你的{lastMode === "recharge" ? "精神充能" : lastMode === "inspiration" ? "灵感触发" : "番茄钟"}模式）
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedForYou.map((product) => (
                  <motion.a
                    key={product.id}
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="block p-6 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/30 hover:border-brand-500/50 transition-all hover:scale-105"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl">
                        {product.image}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-brand-400 mb-1">为你精选</div>
                        <h3 className="font-bold mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{product.scenario}</p>
                        <div className="text-xl font-bold">¥{product.price}</div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "gradient-brand"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-105 overflow-hidden"
              >
                <div 
                  className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.image}
                </div>
                <div className="p-6">
                  <span className="text-xs text-gray-500 mb-1 block">{product.category}</span>
                  <h3 className="font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">¥{product.price}</span>
                    <a
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg gradient-brand text-sm font-medium hover:opacity-90"
                      onClick={(e) => e.stopPropagation()}
                    >
                      去看看 →
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 text-center">
            <h3 className="text-xl font-bold mb-2">更多好物筹备中</h3>
            <p className="text-gray-400 mb-4">
              我们正在精选更多提升专注力的装备，敬请期待。
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-2 rounded-lg gradient-brand font-medium hover:opacity-90 transition-opacity"
            >
              订阅更新通知
            </Link>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-lg w-full bg-[#1a1a2e] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-8xl">
                {selectedProduct.image}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-gray-500">{selectedProduct.category}</span>
                    <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20"
                  >
                    ✕
                  </button>
                </div>
                
                <p className="text-gray-400 mb-4">{selectedProduct.description}</p>
                
                <div className="p-3 rounded-lg bg-brand-500/10 border border-brand-500/20 mb-6">
                  <div className="text-xs text-brand-400 mb-1">💡 专注场景</div>
                  <div>{selectedProduct.scenario}</div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-sm text-gray-400">价格</span>
                    <div className="text-3xl font-bold">¥{selectedProduct.price}</div>
                  </div>
                  <a
                    href={selectedProduct.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 rounded-xl gradient-brand font-semibold hover:opacity-90"
                  >
                    去购买 →
                  </a>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  通过联盟链接购买，我会获得一小部分佣金，用于支持网站运营
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
