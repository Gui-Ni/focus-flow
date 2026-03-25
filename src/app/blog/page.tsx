import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Introducing Focus Flow",
      excerpt: "A new way to think about productivity - not just a timer, but an experience.",
      date: "March 25, 2026",
      category: "Product",
    },
    {
      id: 2,
      title: "The Science of Flow States",
      excerpt: "What happens in your brain when you enter a flow state, and how to get there faster.",
      date: "March 20, 2026",
      category: "Science",
    },
    {
      id: 3,
      title: "Recharge vs Inspiration: Choosing Your Mode",
      excerpt: "When to use each interaction mode for maximum productivity.",
      date: "March 15, 2026",
      category: "Guide",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
            <Link href="/store" className="text-gray-300 hover:text-white transition-colors">
              Store
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
          <p className="text-xl text-gray-400">
            Thoughts on flow states, productivity, and building better tools.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-brand-500/20 text-brand-400">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.date}</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 hover:text-brand-400 transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <button className="text-brand-400 hover:text-brand-300 font-medium">
                  Read more →
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
