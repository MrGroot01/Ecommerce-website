import React, { useContext, useEffect, useState, useRef } from "react";
import "./Products.css";
import { cart_data, f_data, searchvalue } from "../App";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
const OFFERS = [10, 15, 18, 20, 25, 30, 35, 40];
const TAGS = ["Best Seller", "Fresh", "Organic", "Popular", "New"];

const getOffer = (name) => {
  if (!name) return null;
  const code = name.charCodeAt(0) + name.length;
  return OFFERS[code % OFFERS.length];
};

const getTag = (name) => {
  if (!name) return null;
  const code = name.charCodeAt(1) || 0;
  return code % 3 === 0 ? TAGS[code % TAGS.length] : null;
};

const getRating = (name) => {
  if (!name) return "4.0";
  const code = name.charCodeAt(0);
  return (3.5 + (code % 15) / 10).toFixed(1);
};

/* ── Star Rating ── */
const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const reviews = Math.floor(rating * 37 + 12);
  return (
    <div className="stars-row">
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`star-svg ${i < full ? "filled" : i === full && half ? "half" : "empty"}`} viewBox="0 0 20 20">
            {i === full && half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#D1D5DB" />
                  </linearGradient>
                </defs>
                <path fill={`url(#half-${i})`} d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
              </>
            ) : (
              <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
            )}
          </svg>
        ))}
      </div>
      <span className="rating-text">{rating} ({reviews})</span>
    </div>
  );
};

/* ── Wishlist Button ── */
const WishlistBtn = ({ name }) => {
  const [wished, setWished] = useState(false);
  return (
    <button className={`wishlist-btn ${wished ? "wished" : ""}`} onClick={(e) => { e.stopPropagation(); setWished(w => !w); }}>
      <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

/* ── Product Card ── */
const ProductCard = ({ ele, index, onAddCart, onQuickView }) => {
  const offer = getOffer(ele.name);
  const tag = getTag(ele.name);
  const rating = parseFloat(getRating(ele.name));
  const originalPrice = offer ? Math.round(Number(ele.price) / (1 - offer / 100)) : null;
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAddCart = (e) => {
    e.stopPropagation();
    onAddCart({ ...ele, id: "prod-" + index, title: ele.name, image: ele.image || ele.images });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-card" onClick={() => onQuickView(ele, index)}>
      <div className="card-image-wrap">
        {!imgLoaded && <div className="img-skeleton" />}
        <img
          src={ele.image || ele.images}
          alt={ele.name}
          className={`card-img ${imgLoaded ? "loaded" : ""}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x300?text=No+Image"; setImgLoaded(true); }}
        />
        <div className="card-overlay">
          <button className="quick-view-btn" onClick={(e) => { e.stopPropagation(); onQuickView(ele, index); }}>
            Quick View
          </button>
        </div>
        {offer && <span className="offer-badge">{offer}% OFF</span>}
        {tag && <span className={`tag-badge tag-${tag.toLowerCase().replace(" ", "-")}`}>{tag}</span>}
        <WishlistBtn name={ele.name} />
      </div>

      <div className="card-body">
        <p className="card-category">{ele.category || "General"}</p>
        <h3 className="card-title">{ele.name}</h3>
        <StarRating rating={rating} />

        <div className="price-block">
          <div className="price-row">
            <span className="current-price">₹{Number(ele.price).toFixed(0)}</span>
            {originalPrice && <span className="original-price">₹{originalPrice}</span>}
          </div>
          {offer && <span className="save-chip">Save ₹{(originalPrice - Number(ele.price)).toFixed(0)}</span>}
        </div>

        <button className={`add-btn ${added ? "added" : ""}`} onClick={handleAddCart}>
          {added ? (
            <><span className="btn-icon">✓</span> Added!</>
          ) : (
            <><span className="btn-icon">+</span> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

/* ── Quick-View Modal ── */
const QuickViewModal = ({ product, index, onClose, onAddCart, navigate }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!product) return null;

  const offer = getOffer(product.name);
  const rating = parseFloat(getRating(product.name));
  const originalPrice = offer ? Math.round(Number(product.price) / (1 - offer / 100)) : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      onAddCart({ ...product, id: "prod-" + index, title: product.name, image: product.image || product.images });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="modal-grid">
          <div className="modal-image-side">
            <img
              src={product.image || product.images}
              alt={product.name}
              onError={(e) => { e.target.src = "https://via.placeholder.com/400x400?text=No+Image"; }}
            />
            {offer && <span className="modal-offer-badge">{offer}% OFF</span>}
            <div className="modal-img-actions">
              <WishlistBtn name={product.name} />
            </div>
          </div>

          <div className="modal-info-side">
            <div className="modal-top">
              <span className="modal-category">{product.category || "General"}</span>
              {getTag(product.name) && <span className="modal-tag">{getTag(product.name)}</span>}
            </div>
            <h2 className="modal-title">{product.name}</h2>
            <StarRating rating={rating} />

            <div className="modal-price-block">
              <span className="modal-price">₹{Number(product.price).toFixed(0)}</span>
              {originalPrice && (
                <>
                  <span className="modal-original">₹{originalPrice}</span>
                  <span className="modal-save-badge">{offer}% OFF</span>
                </>
              )}
            </div>

            {offer && (
              <div className="modal-savings-bar">
                <span>🎉 You save ₹{(originalPrice - Number(product.price)).toFixed(0)} on this item!</span>
              </div>
            )}

            <p className="modal-description">
              {product.description || "Fresh and quality product delivered right to your doorstep. Sourced carefully to ensure the best quality every time you order."}
            </p>

            <div className="modal-chips">
              <div className="chip"><span>🚚</span> Free Delivery</div>
              <div className="chip"><span>✅</span> Quality Checked</div>
              <div className="chip"><span>🔄</span> Easy Returns</div>
            </div>

            <div className="modal-divider" />

            <div className="modal-qty-label">Quantity</div>
            <div className="modal-actions">
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button className={`modal-cart-btn ${added ? "added" : ""}`} onClick={handleAdd}>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            <button className="view-full-btn" onClick={() => { onClose(); navigate("/product-details", { state: product }); }}>
              View Full Product Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img-wrap" />
    <div className="skeleton-body">
      <div className="sk-line short" />
      <div className="sk-line" />
      <div className="sk-line medium" />
      <div className="sk-line btn" />
    </div>
  </div>
);

/* ── CATEGORIES ── */
const CATEGORIES = [
  { key: "all", label: "All", icon: "🛍️", nav: null },
  { key: "all", label: "Vegetables", icon: "🥦", nav: null },
  { key: "all", label: "Fruits", icon: "🍎", nav: null },
  { key: "pharmacy", label: "Pharmacy", icon: "💊", nav: "/pharmacy" },
  { key: "petcare", label: "Pet Care", icon: "🐾", nav: "/petcare" },
  { key: "babycare", label: "Baby Care", icon: "🍼", nav: "/babycare" },
];

/* ── MAIN ── */
const Products = () => {
  const data1 = useContext(f_data);
  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);
  const navigate = useNavigate();

  const [extraProducts, setExtraProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // grid | list

  const fetchExtraProducts = async () => {
    setLoading(true);
    const urls = [
      "https://babycare-tawz.onrender.com/api/",
      "https://pharmacyapi-1.onrender.com/api/",
      "https://petcare-byc5.onrender.com/api/",
    ];
    const results = await Promise.allSettled(urls.map((url) => fetch(url).then((r) => r.json())));
    const merged = [];
    results.forEach((res) => { if (res.status === "fulfilled") merged.push(...res.value); });
    setExtraProducts(merged);
    setLoading(false);
  };

  useEffect(() => { fetchExtraProducts(); }, []);

  const allProducts = [...(data1 || []), ...extraProducts];
  const searched = allProducts.filter((item) => item.name?.toLowerCase().includes((search || "").toLowerCase()));
  const filtered = category === "all" ? searched : searched.filter((p) => p.category === category);
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "name") return a.name?.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="products-page">

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-left">
            <span className="hero-pill">🔥 Limited Time Deals</span>
            <h1 className="hero-heading">
              Fresh Picks,<br />
              <span className="hero-accent">Unbeatable Prices</span>
            </h1>
            <p className="hero-sub">Farm-fresh produce & daily essentials delivered in minutes</p>
            <div className="hero-trust">
              <div className="trust-item"><span>🚚</span> Free Delivery</div>
              <div className="trust-item"><span>⭐</span> Top Quality</div>
              <div className="trust-item"><span>🔒</span> Secure Checkout</div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stat-card">
              <div className="stat"><span className="stat-num">40%</span><span className="stat-label">Max Off</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">500+</span><span className="stat-label">Products</span></div>
              <div className="stat-divider" />
              <div className="stat"><span className="stat-num">30min</span><span className="stat-label">Delivery</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY NAV ── */}
      <nav className="cat-nav">
        <div className="cat-nav-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`cat-btn ${category === cat.key ? "active" : ""}`}
              onClick={() => { setCategory(cat.key); if (cat.nav) navigate(cat.nav); }}
            >
              <span className="cat-emoji">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── TOOLBAR ── */}
      <div className="toolbar">
        <div className="toolbar-left">
          <p className="result-count">
            {loading ? (
              <span className="loading-dots">Loading<span>.</span><span>.</span><span>.</span></span>
            ) : (
              <><strong>{sorted.length}</strong> products found</>
            )}
          </p>
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid View">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M5 3H3v2h2V3zm0 4H3v2h2V7zm0 4H3v2h2v-2zm4-8H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm4-8h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2z" /></svg>
            </button>
            <button className={`view-btn ${viewMode === "list" ? "active" : ""}`} onClick={() => setViewMode("list")} title="List View">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z" /></svg>
            </button>
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort: Featured</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {/* ── GRID / LIST ── */}
      {loading ? (
        <div className="product-grid">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try a different search term or category</p>
          <button className="empty-reset" onClick={() => setCategory("all")}>Clear Filters</button>
        </div>
      ) : (
        <div className={viewMode === "list" ? "product-list" : "product-grid"}>
          {sorted.map((ele, index) => (
            <ProductCard
              key={index}
              ele={ele}
              index={index}
              onAddCart={cart1}
              onQuickView={(product, idx) => setQuickView({ product, idx })}
            />
          ))}
        </div>
      )}

      {/* ── MODAL ── */}
      {quickView && (
        <QuickViewModal
          product={quickView.product}
          index={quickView.idx}
          onClose={() => setQuickView(null)}
          onAddCart={cart1}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default Products;