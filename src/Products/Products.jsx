import React, { useContext, useEffect, useState } from "react";
import "./Products.css";
import { cart_data, f_data, searchvalue } from "../App";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
const OFFERS   = [10, 15, 18, 20, 25, 30, 35, 40];
const TAGS     = ["Best Seller", "Fresh", "Organic", "Popular", "New Arrival"];

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
  return (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < full ? "star filled" : i === full && half ? "star half" : "star"
          }
        >
          ★
        </span>
      ))}
      <span className="rating-count">({rating})</span>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ ele, index, onAddCart, onQuickView }) => {
  const offer         = getOffer(ele.name);
  const tag           = getTag(ele.name);
  const rating        = parseFloat(getRating(ele.name));
  const originalPrice = offer
    ? Math.round(Number(ele.price) / (1 - offer / 100))
    : null;
  const [added, setAdded] = useState(false);

  const handleAddCart = (e) => {
    e.stopPropagation();
    onAddCart({
      ...ele,
      id: "prod-" + index,
      title: ele.name,
      image: ele.image || ele.images,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card" onClick={() => onQuickView(ele, index)}>
      {offer && <span className="offer-badge">{offer}% OFF</span>}
      {tag   && <span className="tag-badge">{tag}</span>}

      <div className="card-image-wrap">
        <img
          src={ele.image || ele.images}
          alt={ele.name}
          className="card-img"
          onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=No+Image"; }}
        />
      </div>

      <div className="card-body">
        <p className="card-category">{ele.category || "General"}</p>
        <h3 className="card-title">{ele.name}</h3>
        <StarRating rating={rating} />

        <div className="price-row">
          <span className="current-price">₹{Number(ele.price).toFixed(0)}</span>
          {originalPrice && (
            <span className="original-price">₹{originalPrice}</span>
          )}
          {offer && (
            <span className="you-save">
              Save ₹{originalPrice - Number(ele.price).toFixed(0)}
            </span>
          )}
        </div>

        <button
          className={`add-btn ${added ? "added" : ""}`}
          onClick={handleAddCart}
        >
          {added ? "✓ Added!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
};

/* ── Quick-View Modal ── */
const QuickViewModal = ({ product, index, onClose, onAddCart, navigate }) => {
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const offer         = getOffer(product.name);
  const rating        = parseFloat(getRating(product.name));
  const originalPrice = offer
    ? Math.round(Number(product.price) / (1 - offer / 100))
    : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      onAddCart({
        ...product,
        id: "prod-" + index,
        title: product.name,
        image: product.image || product.images,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="modal-grid">
          {/* image */}
          <div className="modal-image-side">
            <img
              src={product.image || product.images}
              alt={product.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400?text=No+Image";
              }}
            />
            {offer && (
              <span className="modal-offer-badge">{offer}% OFF</span>
            )}
          </div>

          {/* info */}
          <div className="modal-info-side">
            <p className="modal-category">{product.category || "General"}</p>
            <h2 className="modal-title">{product.name}</h2>
            <StarRating rating={rating} />

            <div className="modal-price-row">
              <span className="modal-price">
                ₹{Number(product.price).toFixed(0)}
              </span>
              {originalPrice && (
                <span className="modal-original">₹{originalPrice}</span>
              )}
            </div>

            {offer && (
              <div className="modal-savings">
                🎉 You save ₹{originalPrice - Number(product.price).toFixed(0)}{" "}
                ({offer}% off)
              </div>
            )}

            <p className="modal-description">
              {product.description ||
                "Fresh and quality product delivered right to your doorstep. Sourced carefully to ensure the best quality every time."}
            </p>

            {/* delivery info */}
            <div className="modal-delivery-row">
              <span className="delivery-chip">🚚 Free Delivery</span>
              <span className="delivery-chip">✅ Quality Checked</span>
              <span className="delivery-chip">🔄 Easy Returns</span>
            </div>

            {/* qty + cart */}
            <div className="modal-actions">
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button
                className={`modal-cart-btn ${added ? "added" : ""}`}
                onClick={handleAdd}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
            </div>

            <button
              className="view-full-btn"
              onClick={() => {
                onClose();
                navigate("/product-details", { state: product });
              }}
            >
              View Full Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img" />
    <div style={{ padding: "12px" }}>
      <div className="skeleton-line short" />
      <div className="skeleton-line" style={{ marginTop: 8 }} />
      <div className="skeleton-line medium" style={{ marginTop: 8 }} />
      <div className="skeleton-line" style={{ marginTop: 12, height: 36, borderRadius: 10 }} />
    </div>
  </div>
);

/* ── Main Component ── */
const Products = () => {
  const data1  = useContext(f_data);
  const cart1  = useContext(cart_data);
  const search = useContext(searchvalue);
  const navigate = useNavigate();

  const [extraProducts, setExtraProducts] = useState([]);
  const [category, setCategory]           = useState("all");
  const [loading, setLoading]             = useState(true);
  const [quickView, setQuickView]         = useState(null);
  const [sortBy, setSortBy]               = useState("default");

  /* fetch extra APIs */
  const fetchExtraProducts = async () => {
    setLoading(true);
    const urls = [
      "https://babycare-tawz.onrender.com/api/",
      "https://pharmacyapi-1.onrender.com/api/",
      "https://petcare-byc5.onrender.com/api/",
    ];
    const results = await Promise.allSettled(
      urls.map((url) => fetch(url).then((r) => r.json()))
    );
    const merged = [];
    results.forEach((res) => {
      if (res.status === "fulfilled") merged.push(...res.value);
      else console.error("API failed:", res.reason);
    });
    setExtraProducts(merged);
    setLoading(false);
  };

  useEffect(() => { fetchExtraProducts(); }, []);

  /* merge + filter + sort */
  const allProducts = [...(data1 || []), ...extraProducts];

  const searched = allProducts.filter((item) =>
    item.name?.toLowerCase().includes((search || "").toLowerCase())
  );

  const filtered =
    category === "all"
      ? searched
      : searched.filter((p) => p.category === category);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low")  return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "name")       return a.name?.localeCompare(b.name);
    return 0;
  });

  const CATEGORIES = [
    { key: "all",        label: "All",        icon: "🛍️", nav: null },
    { key: "vegetables", label: "Vegetables",  icon: "🥦", nav: "/vegetables" },
    { key: "fruits",     label: "Fruits",      icon: "🍎", nav: "/fruits" },
    { key: "pharmacy",   label: "Pharmacy",    icon: "💊", nav: "/pharmacy" },
    { key: "petcare",    label: "Pet Care",    icon: "🐾", nav: "/petcare" },
    { key: "babycare",   label: "Baby Care",   icon: "🍼", nav: "/babycare" },
  ];

  return (
    <div className="products-page">

      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <div className="hero-text">
          <span className="hero-tag">🔥 Limited Time Offers</span>
          <h1>Up to <span className="hero-highlight">40% OFF</span> on Fresh Picks</h1>
          <p>Quality products delivered fresh to your door</p>
        </div>
        <div className="hero-badges">
          <div className="badge-pill">🚚 Free Delivery</div>
          <div className="badge-pill">✅ Quality Assured</div>
          <div className="badge-pill">🔒 Secure Checkout</div>
        </div>
      </div>

      {/* ── Category Strip ── */}
      <nav className="category-strip">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`cat-pill ${category === cat.key ? "active" : ""}`}
            onClick={() => {
              setCategory(cat.key);
              if (cat.nav) navigate(cat.nav);
            }}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </nav>

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <p className="result-count">
          {loading ? "Loading products…" : `${sorted.length} Products`}
        </p>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort: Featured</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="product-grid">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty-state">
          <span>🔍</span>
          <p>No products found</p>
          <small>Try a different search or category</small>
        </div>
      ) : (
        <div className="product-grid">
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

      {/* ── Quick-View Modal ── */}
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