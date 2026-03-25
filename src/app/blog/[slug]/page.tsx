import Link from "next/link";
import { notFound } from "next/navigation";

const posts: Record<string, {
  title: string;
  cover: string;
  category: string;
  readTime: string;
  date: string;
  content: string;
}> = {
  "what-is-flow-state": {
    title: "什么是心流状态？",
    cover: "🧠",
    category: "科学原理",
    readTime: "5分钟",
    date: "2026-03-25",
    content: `# 什么是心流状态？

心流（Flow）是一种完全沉浸于当前活动的心理状态，在这种状态下，人们会感到：

• 时间感消失 - 几个小时感觉像几分钟
• 行动与意识融合 - 做事自然而然
• 自我意识消失 - 不再担心别人的看法
• 清晰的反馈 - 立即知道做得好不好

## 心流的特征

心理学家米哈里·契克森米哈伊研究发现，心流状态有以下几个关键特征：

1. 清晰的目标
2. 即时反馈
3. 技能与挑战平衡
4. 行动与意识融合

## 如何进入心流？

研究表明，以下因素有助于进入心流状态：

• 明确的目标
• 减少干扰
• 适当的挑战
• 及时的反馈

---

*本文参考自 Csikszentmihalyi 的《心流：最佳体验的心理学》`,
  },
  "attention-residue": {
    title: "注意力残留效应",
    cover: "🎯",
    category: "科学研究",
    readTime: "4分钟",
    date: "2026-03-24",
    content: `# 注意力残留效应

你有没有过这样的经历？

切换任务后，脑子里还在想之前的事情，无法真正集中注意力？

这就是注意力残留效应（Attention Residue）。

## 什么是注意力残留？

Sophie Leroy 教授在2009年的研究中提出：

当我们从任务A切换到任务B时，我们的注意力并不会立即跟上。一部分注意力仍停留在任务A上，这就是"注意力残留"。

## 影响

研究表明：

• 被打断后恢复专注需要23分钟
• 注意力完全恢复前，工作效率下降40%
• 频繁切换任务会让你越来越累

## 如何减少注意力残留？

1. 完成一个任务后再切换
2. 用仪式感标记任务结束
3. 写下来而不是空想着切换

---

*参考文献：Leroy, S. (2009). Why is it so hard to do my work?*`,
  },
  "metaphor-interaction": {
    title: "隐喻式交互设计",
    cover: "💡",
    category: "设计灵感",
    readTime: "6分钟",
    date: "2026-03-23",
    content: `# 隐喻式交互设计

隐喻是人类理解世界的基本方式。在交互设计中，合理运用隐喻可以让复杂的体验变得直观。

## 什么是隐喻式交互？

隐喻式交互是指用熟悉的事物来表达抽象的概念。

比如：
• 收集注意力 → 向中心拖拽光球
• 触发灵感 → 点击漂浮的光点
• 专注时间 → 倒计时沙漏

## 为什么有效？

1. 降低认知成本 - 用已知理解未知
2. 增强记忆 - 具象化更容易记住
3. 情感共鸣 - 有趣的隐喻让人愉悦

## 设计原则

• 隐喻要自然，不能生搬硬套
• 交互要符合隐喻逻辑
• 视觉效果要强化隐喻含义

---

*隐喻认知理论来自 Lakoff & Johnson《我们赖以生存的隐喻》*`,
  },
  "pomodoro-technique": {
    title: "番茄工作法详解",
    cover: "🍅",
    category: "方法论",
    readTime: "3分钟",
    date: "2026-03-22",
    content: `# 番茄工作法详解

番茄工作法是最简单有效的专注技巧之一。

## 什么是番茄工作法？

由弗朗西斯科·齐里洛在1980年代发明：

• 一个番茄钟 = 25分钟专注 + 5分钟休息
• 完成4个番茄钟 = 一次长休息（15-30分钟）

## 为什么有效？

1. 时间盒 - 明确边界，减少拖延
2. 短周期 - 容易开始，不惧怕
3. 规律休息 - 保持精力，避免疲劳

## 如何使用？

1. 选择一个任务
2. 设置25分钟计时器
3. 专注工作，直到计时器响
4. 休息5分钟
5. 每4个番茄钟后，休息15-30分钟

---

*简单的事情重复做，就是诀窍。*`,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split('\n\n');

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <span className="text-sm font-bold">⚡</span>
            </div>
            <span className="font-bold">Focus Flow</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/app" className="text-gray-300 hover:text-white transition-colors">App</Link>
            <Link href="/store" className="text-gray-300 hover:text-white transition-colors">Store</Link>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-5xl mx-auto mb-6">
              {post.cover}
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs bg-brand-500/20 text-brand-400">
                {post.category}
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">{post.readTime}</span>
              <span className="text-gray-500">·</span>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          </div>

          <div className="space-y-4">
            {paragraphs.map((para, i) => {
              if (para.startsWith('# ')) {
                return (
                  <h1 key={i} className="text-3xl font-bold mt-8 mb-4">
                    {para.replace('# ', '')}
                  </h1>
                );
              }
              if (para.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                    {para.replace('## ', '')}
                  </h2>
                );
              }
              if (para.startsWith('• ')) {
                const items = para.split('\n').filter(l => l.startsWith('• '));
                return (
                  <ul key={i} className="list-disc list-inside space-y-2 my-4 text-gray-300">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace('• ', '')}</li>
                    ))}
                  </ul>
                );
              }
              if (para.match(/^\d+\./)) {
                const items = para.split('\n').filter(l => l.match(/^\d+\./));
                return (
                  <ol key={i} className="list-decimal list-inside space-y-2 my-4 text-gray-300">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
                );
              }
              if (para.startsWith('---')) {
                return <hr key={i} className="my-8 border-gray-700" />;
              }
              if (para.startsWith('*') && para.endsWith('*')) {
                return (
                  <p key={i} className="text-gray-500 italic my-4">
                    {para.replace(/\*/g, '')}
                  </p>
                );
              }
              return (
                <p key={i} className="text-gray-300 leading-relaxed">
                  {para}
                </p>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>←</span>
                <span>返回博客</span>
              </Link>
              <Link
                href="/app"
                className="px-6 py-3 rounded-xl gradient-brand font-medium hover:opacity-90 transition-opacity"
              >
                开始专注 →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}
