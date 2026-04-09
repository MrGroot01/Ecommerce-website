import React, { useEffect, useState, useContext } from "react";
import "./Shoes.css";
import { cart_data, searchvalue } from "../App";

/* ── Helpers ── */
const getRating = (item) => item.rating || (3.8 + ((item.id * 7) % 12) / 10).toFixed(1);
const getReviews = (item) => 80 + ((item.id || 1) * 43) % 3000;
const getOriginalPrice = (price, id) => Math.round(price * (1.15 + ((id || 1) % 30) / 100));

const CATEGORIES = [
  { key: "all", label: "All Shoes", icon: "👟" },
  { key: "sports", label: "Sports", icon: "⚽" },
  { key: "casual", label: "Casual", icon: "🧢" },
  { key: "formal", label: "Formal", icon: "👔" },
  { key: "running", label: "Running", icon: "🏃" },
];

/* ── Star Rating ── */
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="sh-stars">
      {[...Array(5)].map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`sh-star ${i < full ? "filled" : i === full && half ? "half" : "empty"}`}>
          <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
        </svg>
      ))}
      <span className="sh-rating-val">{Number(rating).toFixed(1)}</span>
    </div>
  );
};

/* ── Skeleton ── */
const ShoeSkeleton = () => (
  <div className="sh-skeleton">
    <div className="sh-sk-img" />
    <div className="sh-sk-body">
      <div className="sh-sk-line short" />
      <div className="sh-sk-line" />
      <div className="sh-sk-line medium" />
      <div className="sh-sk-line btn" />
    </div>
  </div>
);

/* ── Size Selector ── */
const SizeSelector = ({ sizes }) => {
  const [selected, setSelected] = useState(null);
  const sizeArr = sizes ? sizes.toString().split(",").map(s => s.trim()) : [];
  if (!sizeArr.length) return null;
  return (
    <div className="sh-sizes">
      <span className="sh-size-label">Size:</span>
      <div className="sh-size-btns">
        {sizeArr.map(s => (
          <button
            key={s}
            className={`sh-size-btn ${selected === s ? "selected" : ""}`}
            onClick={e => { e.stopPropagation(); setSelected(s); }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
};

/* ── Wish Button ── */
const WishBtn = ({ id }) => {
  const [wished, setWished] = useState(false);
  return (
    <button className={`sh-wish ${wished ? "wished" : ""}`} onClick={e => { e.stopPropagation(); setWished(w => !w); }}>
      <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

/* ── Product Card ── */
const ShoeCard = ({ el, onAddCart }) => {
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const rating = getRating(el);
  const reviews = getReviews(el);
  const origPrice = getOriginalPrice(Number(el.price), el.id);
  const discount = Math.round(((origPrice - Number(el.price)) / origPrice) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddCart({ ...el, title: el.name, image: el.image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="sh-card">
      <div className="sh-img-wrap">
        {!imgLoaded && <div className="sh-img-skeleton" />}
        <img
          src={el.image}
          alt={el.name}
          className={`sh-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
          onError={e => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; setImgLoaded(true); }}
        />
        <div className="sh-badge-wrap">
          {discount > 0 && <span className="sh-badge discount">-{discount}%</span>}
          {el.color && <span className="sh-badge color">{el.color}</span>}
        </div>
        <WishBtn id={el.id} />
        <div className="sh-overlay">
          <span>Quick View</span>
        </div>
      </div>

      <div className="sh-body">
        <div className="sh-brand-cat">
          <span className="sh-brand">{el.brand}</span>
          <span className="sh-cat">{el.category}</span>
        </div>
        <h3 className="sh-name">{el.name}</h3>
        <StarRating rating={rating} />
        <span className="sh-reviews">({reviews.toLocaleString()} reviews)</span>
        <SizeSelector sizes={el.size} />
        <div className="sh-price-row">
          <span className="sh-price">₹{Number(el.price).toLocaleString()}</span>
          <span className="sh-orig">₹{origPrice.toLocaleString()}</span>
          <span className="sh-save">Save ₹{(origPrice - Number(el.price)).toLocaleString()}</span>
        </div>
        <div className="sh-chips">
          <span className="sh-chip">🚚 Free Delivery</span>
          <span className="sh-chip">↩️ 7-Day Return</span>
        </div>
        <button className={`sh-add-btn ${added ? "added" : ""}`} onClick={handleAdd}>
          {added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
};

/* ── MAIN ── */
const Shoes = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");

  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  useEffect(() => {
    setLoading(true);
    fetch("https://shoes-api-oc8p.onrender.com/shoes/")
      .then(r => r.json())
      .then(data => {
        const items = Array.isArray(data) ? data : data.results || [];
        setProducts(items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(item => {
    const matchSearch = item.name?.toLowerCase().includes((search || "").toLowerCase());
    const matchCat = category === "all" || item.category?.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "rating") return Number(b.rating || 0) - Number(a.rating || 0);
    if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
    return 0;
  });

  return (
    <div className="sh-page">
      {/* HERO */}
      <section className="sh-hero">
        <div className="sh-hero-inner">
          <div className="sh-hero-left">
            <span className="sh-hero-pill">👟 New Collection</span>
            <h1 className="sh-hero-title">Step Into<br /><span className="sh-hero-accent">Style & Comfort</span></h1>
            <p className="sh-hero-sub">Premium footwear for every occasion — sports, casual & formal</p>
            <div className="sh-hero-trust">
              <span>🚚 Free Delivery</span>
              <span>↩️ 7-Day Returns</span>
              <span>✅ 100% Authentic</span>
            </div>
          </div>
          <div className="sh-hero-stats">
            <div className="sh-stat"><span className="sh-stat-num">500+</span><span className="sh-stat-lbl">Styles</span></div>
            <div className="sh-stat-div" />
            <div className="sh-stat"><span className="sh-stat-num">40%</span><span className="sh-stat-lbl">Max Off</span></div>
            <div className="sh-stat-div" />
            <div className="sh-stat"><span className="sh-stat-num">Top</span><span className="sh-stat-lbl">Brands</span></div>
          </div>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <nav className="sh-cat-nav">
        <div className="sh-cat-inner">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`sh-cat-btn ${category === c.key ? "active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* TOOLBAR */}
      <div className="sh-toolbar">
        <p className="sh-result-count">
          {loading
            ? "Loading..."
            : <><strong>{sorted.length}</strong> shoes found</>
          }
        </p>
        <div className="sh-toolbar-right">
          <div className="sh-view-toggle">
            <button className={`sh-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3H3v2h2V3zm0 4H3v2h2V7zm0 4H3v2h2v-2zm4-8H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm4-8h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2z" /></svg>
            </button>
            <button className={`sh-view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")}>
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" /></svg>
            </button>
          </div>
          <select className="sh-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
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
        <div className="sh-grid">
          {[...Array(8)].map((_, i) => <ShoeSkeleton key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="sh-empty">
          <div className="sh-empty-icon">👟</div>
          <h3>No shoes found</h3>
          <p>Try a different category or search term</p>
          <button onClick={() => setCategory("all")}>Clear Filters</button>
        </div>
      ) : (
        <div className={viewMode === "list" ? "sh-list" : "sh-grid"}>
          {sorted.map(el => (
            <ShoeCard key={el.id} el={el} onAddCart={cart1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shoes;