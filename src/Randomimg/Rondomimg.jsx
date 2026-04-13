import React, { useContext, useEffect, useState, useRef } from "react";
import './Rodomimg.css'
import { searchvalue } from "../App";

const CATEGORIES = ["All", "Nature", "Architecture", "People", "Abstract", "Travel"];

const ProductListing = () => {
  const search = useContext(searchvalue);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [toast, setToast] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedItems, setAddedItems] = useState({});
  const toastTimer = useRef(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
      const data = await res.json();
      const enriched = data.map((item) => ({
        ...item,
        price: (Math.random() * 180 + 20).toFixed(2),
        originalPrice: (Math.random() * 250 + 80).toFixed(2),
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        reviews: Math.floor(Math.random() * 400 + 30),
        badge: Math.random() > 0.75 ? (Math.random() > 0.5 ? "NEW" : "SALE") : null,
        category: CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 1)) + 1],
      }));
      setProducts(enriched);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.id === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems((prev) => ({ ...prev, [product.id]: false })), 1200);
    showToast(`"${product.author}" added to cart!`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, c) => sum + parseFloat(c.price) * c.qty, 0);

  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.author.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="shop-root">
      {/* ── HERO BANNER ── */}
      <section className="shop-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Summer Collection 2025</span>
          <h1 className="hero-title">Discover <em>Your</em> Style</h1>
          <p className="hero-sub">Curated pieces for the modern explorer</p>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">12K+</span><span className="stat-label">Products</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">4.9★</span><span className="stat-label">Rating</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">Free</span><span className="stat-label">Shipping</span></div>
        </div>
      </section>

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <span className="result-count">{filtered.length} items</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <button className="cart-fab" onClick={() => setCartOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cart.length > 0 && <span className="cart-badge">{cart.reduce((s, c) => s + c.qty, 0)}</span>}
          </button>
        </div>
      </div>

      {/* ── GRID ── */}
      <main className="product-grid">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-line w80" />
              <div className="skeleton-line w50" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <p>No products match your search.</p>
          </div>
        ) : (
          filtered.map((product, idx) => (
            <article
              key={product.id}
              className="card"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {product.badge && (
                <span className={`badge badge-${product.badge.toLowerCase()}`}>
                  {product.badge}
                </span>
              )}
              <button
                className={`wish-btn ${wishlist.includes(product.id) ? "wished" : ""}`}
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
              >
                <svg viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>

              <div className="card-img-wrap">
                <img
                  src={`https://picsum.photos/id/${product.id}/400/300`}
                  alt={product.author}
                  loading="lazy"
                />
                <div className="img-overlay">
                  <button className="quick-view-btn">Quick View</button>
                </div>
              </div>

              <div className="card-body">
                <span className="card-category">{product.category}</span>
                <h3 className="card-title">{product.author}</h3>
                <div className="card-rating">
                  <span className="stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
                  <span className="review-count">({product.reviews})</span>
                </div>
                <div className="card-footer">
                  <div className="price-block">
                    <span className="price">${product.price}</span>
                    <span className="original-price">${product.originalPrice}</span>
                  </div>
                  <button
                    className={`add-btn ${addedItems[product.id] ? "added" : ""}`}
                    onClick={() => addToCart(product)}
                  >
                    {addedItems[product.id] ? (
                      <>✓ Added</>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {/* ── PAGINATION ── */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Previous
        </button>
        <div className="page-dots">
          {[page - 1, page, page + 1].filter((n) => n > 0).map((n) => (
            <button
              key={n}
              className={`page-dot ${n === page ? "active" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <button className="page-btn" onClick={() => setPage((p) => p + 1)}>
          Next →
        </button>
      </div>

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div className="drawer-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Your Cart</h2>
              <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🛒</span>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img src={`https://picsum.photos/id/${item.id}/80/80`} alt={item.author} />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.author}</p>
                        <p className="cart-item-price">${item.price} × {item.qty}</p>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="total-price">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn">Proceed to Checkout →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span>✓</span> {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ProductListing;