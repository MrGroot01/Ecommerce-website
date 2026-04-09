import React, { useEffect, useState, useContext } from "react";
import "./Electric.css";
import { cart_data, searchvalue } from "../App";

/* ── Helpers ── */
const getReviews = (id) => 200 + ((id || 1) * 57) % 5000;

const CATEGORIES = [
  { key: "all", label: "All", icon: "🔌" },
  { key: "Mobile", label: "Mobiles", icon: "📱" },
  { key: "Laptops", label: "Laptops", icon: "💻" },
  { key: "TV", label: "TV", icon: "📺" },
  { key: "Headphone", label: "Headphones", icon: "🎧" },
  { key: "Earbuds", label: "Earbuds", icon: "🎵" },
  { key: "Speakers", label: "Speakers", icon: "🔊" },
  { key: "Camera", label: "Camera", icon: "📷" },
];

/* ── Stars ── */
const StarRating = ({ rating }) => {
  const full = Math.floor(Number(rating));
  const half = Number(rating) % 1 >= 0.5;
  return (
    <div className="el-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`el-star ${i < full ? "filled" : i === full && half ? "half" : "empty"}`}>
          <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
        </svg>
      ))}
      <span className="el-rating-val">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

/* ── Skeleton ── */
const ElSkeleton = () => (
  <div className="el-skeleton">
    <div className="el-sk-img" />
    <div className="el-sk-body">
      {[1, 2, 3, 4].map(i => <div key={i} className={`el-sk-line ${i === 1 ? "short" : i === 3 ? "medium" : i === 4 ? "btn" : ""}`} />)}
    </div>
  </div>
);

/* ── Wish Button ── */
const WishBtn = ({ id }) => {
  const [wished, setWished] = useState(false);
  return (
    <button className={`el-wish ${wished ? "wished" : ""}`} onClick={e => { e.stopPropagation(); setWished(w => !w); }}>
      <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

/* ── Product Card ── */
const ElCard = ({ el, onAddCart }) => {
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const price = Number(el.discount_price || el.price);
  const origPrice = Number(el.price);
  const discount = el.discount_price ? Math.round(((origPrice - price) / origPrice) * 100) : 0;
  const reviews = getReviews(el.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!el.available) return;
    onAddCart({ ...el, title: el.name, image: el.image, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="el-card">
      <div className="el-img-wrap">
        {!imgLoaded && <div className="el-img-skeleton" />}
        <img
          src={el.image}
          alt={el.name}
          className={`el-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; setImgLoaded(true); }}
        />
        <div className="el-badges">
          {discount > 0 && <span className="el-badge red">-{discount}%</span>}
          {!el.available && <span className="el-badge out">Out of Stock</span>}
          {el.available && el.stock <= 5 && el.stock > 0 && <span className="el-badge low">Only {el.stock} left</span>}
        </div>
        <WishBtn id={el.id} />
        <div className="el-overlay"><span>Quick View</span></div>
      </div>

      <div className="el-body">
        <div className="el-meta">
          <span className="el-brand">{el.brand}</span>
          <span className="el-cat-tag">{el.category}</span>
        </div>
        <h3 className="el-name">{el.name}</h3>
        <StarRating rating={el.rating || 4.0} />
        <span className="el-reviews">({reviews.toLocaleString()} reviews)</span>

        <div className="el-price-wrap">
          <span className="el-price">₹{price.toLocaleString()}</span>
          {discount > 0 && (
            <>
              <span className="el-orig">₹{origPrice.toLocaleString()}</span>
              <span className="el-save">Save ₹{(origPrice - price).toLocaleString()}</span>
            </>
          )}
        </div>

        <p className="el-desc">{el.description}</p>

        <div className="el-chips">
          <span className="el-chip">🚚 Free Delivery</span>
          <span className="el-chip">🛡️ 1 Year Warranty</span>
          {el.available && <span className="el-chip el-instock">✅ In Stock</span>}
        </div>

        <button
          className={`el-add-btn ${added ? "added" : ""} ${!el.available ? "disabled" : ""}`}
          onClick={handleAdd}
          disabled={!el.available}
        >
          {!el.available ? "Out of Stock" : added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
};

/* ── MAIN ── */
const Electric = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");

  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  useEffect(() => {
    setLoading(true);
    fetch("https://electronicsitems.onrender.com/api/")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : data.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes((search || "").toLowerCase());
    const matchCat = category === "all" || item.category?.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    const pa = Number(a.discount_price || a.price);
    const pb = Number(b.discount_price || b.price);
    if (sortBy === "price-low") return pa - pb;
    if (sortBy === "price-high") return pb - pa;
    if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <div className="el-page">
      {/* HERO */}
      <section className="el-hero">
        <div className="el-hero-inner">
          <div className="el-hero-left">
            <span className="el-hero-pill">⚡ Latest Tech</span>
            <h1 className="el-hero-title">Next-Gen<br /><span className="el-hero-accent">Electronics</span></h1>
            <p className="el-hero-sub">Top brands, unbeatable prices — Mobiles, Laptops, TV & more</p>
            <div className="el-hero-trust">
              <span>🛡️ 1 Year Warranty</span>
              <span>🚚 Free Delivery</span>
              <span>↩️ Easy Returns</span>
            </div>
          </div>
          <div className="el-hero-stats">
            <div className="el-stat"><span className="el-stat-num">150+</span><span className="el-stat-lbl">Products</span></div>
            <div className="el-stat-div" />
            <div className="el-stat"><span className="el-stat-num">30%</span><span className="el-stat-lbl">Max Off</span></div>
            <div className="el-stat-div" />
            <div className="el-stat"><span className="el-stat-num">Top</span><span className="el-stat-lbl">Brands</span></div>
          </div>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <nav className="el-cat-nav">
        <div className="el-cat-inner">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`el-cat-btn ${category === c.key ? "active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              <span className="el-cat-icon">{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* TOOLBAR */}
      <div className="el-toolbar">
        <p className="el-result-count">
          {loading ? "Loading..." : <><strong>{sorted.length}</strong> products found</>}
        </p>
        <div className="el-toolbar-right">
          <div className="el-view-toggle">
            <button className={`el-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3H3v2h2V3zm0 4H3v2h2V7zm0 4H3v2h2v-2zm4-8H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm4-8h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2z" /></svg>
            </button>
            <button className={`el-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" /></svg>
            </button>
          </div>
          <select className="el-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="el-grid">
          {[...Array(8)].map((_, i) => <ElSkeleton key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="el-empty">
          <div className="el-empty-icon">📱</div>
          <h3>No products found</h3>
          <p>Try a different category or search</p>
          <button onClick={() => setCategory("all")}>Clear Filters</button>
        </div>
      ) : (
        <div className={viewMode === "list" ? "el-list" : "el-grid"}>
          {sorted.map(el => <ElCard key={el.id} el={el} onAddCart={cart1} />)}
        </div>
      )}
    </div>
  );
};

export default Electric;