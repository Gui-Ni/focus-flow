import Link from "next/link";
import Logo from "@/components/LogoWrapper";

// 博客文章数据（后期可以从数据库或CMS读取）
const posts = [
  {
    slug: "what-is-flow-state",
    title: "什么是心流状态？",
    title_en: "What is Flow State?",
    excerpt: "心流（Flow）是一种完全沉浸于当前活动的心理状态，让我们一起来了解它的科学原理。",
    cover: "🧠",
    category: "科学原理",
    readTime: "5分钟",
    date: "2026-03-25",
    content: `
# 什么是心流状态？

心流（Flow）是一种完全沉浸于当前活动的心理状态，在这种状态下，人们会感到：

- **时间感消失** - 几个小时感觉像几分钟
- **行动与意识融合** - 做事自然而然
- **自我意识消失** - 不再担心别人的看法
- **清晰的反馈** - 立即知道做得好不好

## 心流的特征

心理学家米哈里·契克森米哈伊（Mihaly Csikszentmihalyi）研究发现，心流状态有以下几个关键特征：

1. **清晰的目标**
2. **即时反馈**
3. **技能与挑战平衡**
4. **行动与意识融合**

## 如何进入心流？

研究表明，以下因素有助于进入心流状态：

- 明确的目标
- 减少干扰
- 适当的挑战
- 及时的反馈

---

*本文参考自 Csikszentmihalyi 的《心流：最佳体验的心理学》*
    `.trim(),
  },
  {
    slug: "attention-residue",
    title: "注意力残留效应",
    title_en: "Attention Residue Effect",
    excerpt: "切换任务后，为什么很难集中注意力？注意力残留可能是罪魁祸首。",
    cover: "🎯",
    category: "科学研究",
    readTime: "4分钟",
    date: "2026-03-24",
    content: `
# 注意力残留效应

你有没有过这样的经历？

切换任务后，脑子里还在想之前的事情，无法真正集中注意力？

这就是**注意力残留效应（Attention Residue）**。

## 什么是注意力残留？

Sophie Leroy 教授在2009年的研究中提出：

> 当我们从任务A切换到任务B时，我们的注意力并不会立即跟上。一部分注意力仍停留在任务A上，这就是"注意力残留"。

## 影响

研究表明：

- 被打断后恢复专注需要 **23分钟**
- 注意力完全恢复前，工作效率下降 **40%**
- 频繁切换任务会让你越来越累

## 如何减少注意力残留？

1. **完成一个任务后再切换**
2. **用仪式感标记任务结束**
3. **写下来而不是空想着切换**

---

*参考文献：Leroy, S. (2009). Why is it so hard to do my work?*
    `.trim(),
  },
  {
    slug: "metaphor-interaction",
    title: "隐喻式交互设计",
    title_en: "Metaphorical Interaction Design",
    excerpt: "用熟悉的事物理解抽象概念，让交互更直观、更自然。",
    cover: "💡",
    category: "设计灵感",
    readTime: "6分钟",
    date: "2026-03-23",
    content: `
# 隐喻式交互设计

隐喻是人类理解世界的基本方式。在交互设计中，合理运用隐喻可以让复杂的体验变得直观。

## 什么是隐喻式交互？

隐喻式交互是指用**熟悉的事物**来表达**抽象的概念**。

比如：

| 抽象概念 | 隐喻形式 |
|---------|---------|
| 收集注意力 | 向中心拖拽光球 |
| 触发灵感 | 点击漂浮的光点 |
| 专注时间 | 倒计时沙漏 |

## 为什么有效？

1. **降低认知成本** - 用已知理解未知
2. **增强记忆** - 具象化更容易记住
3. **情感共鸣** - 有趣的隐喻让人愉悦

## 设计原则

- 隐喻要**自然**，不能生搬硬套
- 交互要**符合隐喻逻辑**
- 视觉效果要**强化隐喻含义**

---

*隐喻认知理论来自 Lakoff & Johnson《我们赖以生存的隐喻》*
    `.trim(),
  },
  {
    slug: "pomodoro-technique",
    title: "番茄工作法详解",
    title_en: "The Pomodoro Technique",
    excerpt: "简单却强大的时间管理方法，让你的专注效率翻倍。",
    cover: "🍅",
    category: "方法论",
    readTime: "3分钟",
    date: "2026-03-22",
    content: `
# 番茄工作法详解

番茄工作法是最简单有效的专注技巧之一。

## 什么是番茄工作法？

由弗朗西斯科·齐里洛（Francesco Cirillo）在1980年代发明：

- **一个番茄钟** = 25分钟专注 + 5分钟休息
- **完成4个番茄钟** = 一次长休息（15-30分钟）

## 为什么有效？

1. **时间盒** - 明确边界，减少拖延
2. **短周期** - 容易开始，不惧怕
3. **规律休息** - 保持精力，避免疲劳

## 如何使用？

1. 选择一个任务
2. 设置25分钟计时器
3. 专注工作，直到计时器响
4. 休息5分钟
5. 每4个番茄钟后，休息15-30分钟

---

*简单的事情重复做，就是诀窍。*
    `.trim(),
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" animate={false} />
            <span className="font-bold">Focus Flow</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/app" className="text-gray-300 hover:text-white transition-colors">
              App
            </Link>
            <Link href="/store" className="text-gray-300 hover:text-white transition-colors">
              Store
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">博客</h1>
          <p className="text-xl text-gray-400">
            关于心流、专注力与设计的心得分享
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
                    {post.cover}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs bg-brand-500/20 text-brand-400">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <span className="text-sm text-gray-500">·</span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-brand-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 text-center">
            <h3 className="text-xl font-bold mb-2">更多文章筹备中</h3>
            <p className="text-gray-400 mb-4">
              关于专注力、冥想、设计思维的深度内容即将上线。
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
    </main>
  );
}
