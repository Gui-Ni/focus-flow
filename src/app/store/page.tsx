import Link from "next/link";

export default function StorePage() {
  const products = [
    {
      id: 1,
      name: "Flow State Poster",
      description: "A beautiful poster featuring the concept of flow state and mindfulness.",
      price: 29,
      image: "🖼️",
      category: "Print",
    },
    {
      id: 2,
      name: "Focus Flow T-Shirt",
      description: "Comfortable cotton t-shirt with our signature lightning bolt design.",
      price: 35,
      image: "👕",
      category: "Apparel",
    },
    {
      id: 3,
      name: "Flow Journal",
      description: "A guided journal for tracking your flow sessions and reflections.",
      price: 24,
      image: "📓",
      category: "Stationery",
    },
    {
      id: 4,
      name: "Sticker Pack",
      description: "A pack of 10 vinyl stickers featuring flow state themes.",
      price: 12,
      image: "🏷️",
      category: "Stickers",
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
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              Blog
            </Link>
            <button className="relative">
              <span className="text-xl">🛒</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-xs flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Flow Flow Store</h1>
          <p className="text-xl text-gray-400">
            Merchandise and tools to support your flow state journey.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
              >
                <div className="aspect-square rounded-t-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <div className="p-6">
                  <span className="text-xs text-gray-500 mb-2 block">{product.category}</span>
                  <h2 className="font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                    <button className="px-4 py-2 rounded-lg gradient-brand text-sm font-medium hover:opacity-90 transition-opacity">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-brand-500/10 to-purple-500/10 border border-brand-500/20 text-center">
            <h3 className="text-xl font-bold mb-2">More Coming Soon</h3>
            <p className="text-gray-400 mb-4">
              We&apos;re working on physical products related to flow states and mindfulness.
            </p>
            <Link
              href="/signup"
              className="inline-block px-6 py-2 rounded-lg gradient-brand font-medium hover:opacity-90 transition-opacity"
            >
              Get notified
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
