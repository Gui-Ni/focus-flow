"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Flow State Poster",
    description: "A beautiful poster featuring the concept of flow state and mindfulness. Perfect for your workspace.",
    price: 29,
    image: "🖼️",
    category: "Print",
  },
  {
    id: 2,
    name: "Focus Flow T-Shirt",
    description: "Comfortable cotton t-shirt with our signature lightning bolt design. Premium quality.",
    price: 35,
    image: "👕",
    category: "Apparel",
  },
  {
    id: 3,
    name: "Flow Journal",
    description: "A guided journal for tracking your flow sessions and reflections. 120 pages.",
    price: 24,
    image: "📓",
    category: "Stationery",
  },
  {
    id: 4,
    name: "Sticker Pack",
    description: "A pack of 10 vinyl stickers featuring flow state themes. Waterproof.",
    price: 12,
    image: "🏷️",
    category: "Stickers",
  },
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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
            <button
              onClick={() => setShowCart(true)}
              className="relative"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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
                className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-105 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="aspect-square rounded-t-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl">
                  {product.image}
                </div>
                <div className="p-6">
                  <span className="text-xs text-gray-500 mb-2 block">{product.category}</span>
                  <h2 className="font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-4 py-2 rounded-lg gradient-brand text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Add
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
              className="bg-[#1a1a2e] rounded-2xl max-w-lg w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-8xl text-center mb-6">{selectedProduct.image}</div>
              <span className="text-xs text-gray-500">{selectedProduct.category}</span>
              <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-400 mb-6">{selectedProduct.description}</p>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold">${selectedProduct.price}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 rounded-xl gradient-brand font-semibold hover:opacity-90 transition-opacity"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1a1a2e] z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">
                      <div className="text-4xl mb-4">🛒</div>
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-4 p-4 rounded-xl bg-white/5"
                        >
                          <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-2xl">
                            {item.product.image}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-gray-400">${item.product.price}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="w-6 h-6 rounded bg-white/10 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Total</span>
                      <span className="text-2xl font-bold">${cartTotal}</span>
                    </div>
                    <button className="w-full py-3 rounded-xl gradient-brand font-semibold hover:opacity-90 transition-opacity">
                      Checkout (Coming Soon)
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
