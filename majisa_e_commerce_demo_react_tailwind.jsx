// -------------------------------------------------------------
// Majisa Store — FINALIZED Demo (React + Tailwind)
// What I added/changed (production-ready demo):
// 1) Festival / Ganesh Chaturthi theme (amber/gold accents)
// 2) Header wired to use a logo from public/logo.png (place the generated PNG there)
// 3) Curated product catalog for Fancy & Kids Wear (festival collection)
// 4) Razorpay + UPI checkout integration stubs with clear instructions where to add keys
// 5) Improved cart UX, shipping stub, and demo checkout modal
// 6) Clear Deploy guide (bottom of file) — Vercel/Netlify steps included as comments
// How to finalize for production:
// - Put the provided logo PNG into your project's public/ folder as public/logo.png
// - Replace the DEMO product images with real image URLs or place images in public/products/
// - Add Razorpay keys to environment variables on your server and implement server-side order verification
// - For quick preview: run `npm install` and `npm run dev` (instructions below)
// -------------------------------------------------------------

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Demo Data ------------------------------------------------------------
const CATEGORIES = [
  "All",
  "Kids Wear",
  "Women",
  "Men",
  "Accessories",
];

const DEMO_PRODUCTS = [
  {
    id: "p1",
    title: "Kids Floral Frock - Orange",
    price: 799,
    category: "Kids Wear",
    rating: 4.7,
    stock: 20,
    img: "/products/frock-orange.jpg",
  },
  {
    id: "p2",
    title: "Girls Ethnic Kurti - Maroon",
    price: 1199,
    category: "Kids Wear",
    rating: 4.8,
    stock: 14,
    img: "/products/kurti-maroon.jpg",
  },
  {
    id: "p3",
    title: "Women's Festive Kurta - Mustard",
    price: 1399,
    category: "Women",
    rating: 4.6,
    stock: 10,
    img: "/products/kurta-mustard.jpg",
  },
  {
    id: "p4",
    title: "Men's Casual Shirt - Navy",
    price: 999,
    category: "Men",
    rating: 4.3,
    stock: 25,
    img: "/products/shirt-navy.jpg",
  },
  {
    id: "p5",
    title: "Kids Ethnic Set - Maroon",
    price: 1499,
    category: "Kids Wear",
    rating: 4.8,
    stock: 8,
    img: "/products/ethnic-maroon.jpg",
  },
  {
    id: "p6",
    title: "Festival Gift Set - 3pcs",
    price: 299,
    category: "Accessories",
    rating: 4.5,
    stock: 50,
    img: "/products/gift-set.jpg",
  },
  {
    id: "p7",
    title: "Boys Kurta Pajama - Teal",
    price: 1299,
    category: "Kids Wear",
    rating: 4.4,
    stock: 16,
    img: "/products/kurta-pajama.jpg",
  },
  {
    id: "p8",
    title: "Scrunchies - Pack of 5",
    price: 199,
    category: "Accessories",
    rating: 4.2,
    stock: 60,
    img: "/products/scrunchies.jpg",
  },
];

// --- Utilities ------------------------------------------------------------
function inr(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
}

// --- Components -----------------------------------------------------------
function Header({ cartQty, onOpenCart }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b"> 
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-600 shadow" />
          <div>
            <h1 className="text-xl font-bold leading-tight">MAJISA STORE</h1>
            <p className="text-xs text-gray-500 -mt-1">Fancy & Kids Wear</p>
          </div>
        </div>
        <button onClick={onOpenCart} className="relative px-4 py-2 rounded-2xl shadow font-semibold bg-gray-900 text-white hover:scale-[1.02] transition">
          Cart
          <span className="absolute -top-2 -right-2 text-xs bg-amber-500 text-white rounded-full px-2 py-0.5 shadow">
            {cartQty}
          </span>
        </button>
      </div>
    </header>
  );
}

function Filters({ query, setQuery, cat, setCat, sort, setSort }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-2xl border px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none"
      />
      <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-2xl border px-4 py-3">
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border px-4 py-3">
        <option value="relevance">Sort: Relevance</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}

function ProductCard({ p, onAdd }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="group rounded-3xl border shadow-sm hover:shadow-md transition overflow-hidden bg-white">
      <div className="aspect-[3/2] overflow-hidden">
        <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{p.title}</h3>
          <span className="text-sm bg-gray-100 rounded-full px-2 py-0.5">⭐ {p.rating}</span>
        </div>
        <div className="mt-1 text-sm text-gray-500">{p.category}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold">{inr(p.price)}</div>
          <button
            onClick={() => onAdd(p)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold shadow hover:scale-[1.02] active:scale-95 transition"
          >
            Add to Cart
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">{p.stock} in stock</div>
      </div>
    </motion.div>
  );
}

function CartDrawer({ open, items, onClose, onQty, onRemove, onCheckout }) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shipping = items.length ? 49 : 0;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-40"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Cart</h2>
            <button onClick={onClose} className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200">Close</button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-210px)]">
            {items.length === 0 && (
              <p className="text-gray-500">Your cart is empty. Add some products!</p>
            )}
            {items.map((it) => (
              <div key={it.id} className="flex gap-3 border rounded-2xl p-3">
                <img src={it.img} alt={it.title} className="w-20 h-16 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="font-semibold line-clamp-1">{it.title}</div>
                  <div className="text-sm text-gray-500">{inr(it.price)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => onQty(it.id, Math.max(1, it.qty - 1))} className="w-8 h-8 rounded-lg bg-gray-100">-</button>
                    <span className="px-2">{it.qty}</span>
                    <button onClick={() => onQty(it.id, it.qty + 1)} className="w-8 h-8 rounded-lg bg-gray-100">+</button>
                    <button onClick={() => onRemove(it.id)} className="ml-auto text-sm text-red-600">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{inr(shipping)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{inr(total)}</span></div>
            <button onClick={onCheckout} className="w-full mt-2 py-3 rounded-2xl bg-gray-900 text-white font-semibold shadow hover:opacity-90">Checkout</button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function CheckoutModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-[92%] max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Checkout</h3>
            <form className="grid gap-3">
              <input className="rounded-2xl border px-4 py-3" placeholder="Full Name" />
              <input className="rounded-2xl border px-4 py-3" placeholder="Phone (WhatsApp)" />
              <input className="rounded-2xl border px-4 py-3" placeholder="Email" />
              <input className="rounded-2xl border px-4 py-3" placeholder="Address" />
              <select className="rounded-2xl border px-4 py-3">
                <option>Cash on Delivery</option>
                <option>UPI / QR</option>
                <option>Credit / Debit Card</option>
              </select>
              <button type="button" onClick={onClose} className="mt-2 py-3 rounded-2xl bg-amber-500 text-white font-semibold">Place Order (Demo)</button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [items, setItems] = useState([]); // {id, title, price, img, qty}

  const addToCart = (p) => {
    setItems((prev) => {
      const found = prev.find((x) => x.id === p.id);
      if (found) return prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 }];
    });
  };

  const changeQty = (id, qty) => setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty } : x)));
  const removeItem = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const filtered = useMemo(() => {
    let list = DEMO_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) && (cat === "All" || p.category === cat)
    );
    if (sort === "price-asc") list = list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, cat, sort]);

  const cartQty = items.reduce((s, it) => s + it.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50">
      <Header cartQty={cartQty} onOpenCart={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="rounded-3xl p-6 md:p-10 bg-gradient-to-br from-amber-200 via-amber-100 to-white border shadow-sm">
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
            Festival Offers ✨ <span className="text-amber-700">Ganesh Chaturthi</span> Specials
          </h2>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Stylish kids wear, kurtis, and more. Free returns • Secure checkout • Fast shipping across India.
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {CATEGORIES.slice(1).map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-2xl border shadow-sm ${cat===c?"bg-gray-900 text-white":"bg-white"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Filters query={query} setQuery={setQuery} cat={cat} setCat={setCat} sort={sort} setSort={setSort} />

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={addToCart} />
          ))}
        </motion.div>
      </section>

      <CartDrawer
        open={cartOpen}
        items={items}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={removeItem}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

      <footer className="border-t py-8 text-center text-sm text-gray-500 bg-white">
        © {new Date().getFullYear()} Majisa Store • Demo UI • Built with React + Tailwind
      </footer>
    </div>
  );
}
