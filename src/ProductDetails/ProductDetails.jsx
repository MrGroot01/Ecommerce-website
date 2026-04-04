import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import Checkout from "../Checkout/Checkout";

/* ── helpers ── */
const OFFERS = [10, 15, 18, 20, 25, 30, 35, 40];

const getOffer = (name) => {
  if (!name) return null;
  const code = name.charCodeAt(0) + name.length;
  return OFFERS[code % OFFERS.length];
};

const getRating = (name) => {
  if (!name) return "4.2";
  return (3.5 + (name.charCodeAt(0) % 15) / 10).toFixed(1);
};

/* ── Stars ── */
const Stars = ({ rating, count }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="pd-stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < full ? "pdstar on" : i === full && half ? "pdstar half" : "pdstar"
          }
        >★</span>
      ))}
      <span className="pd-rval">{rating}</span>
      {count && <><span className="pd-rsep">|</span><span className="pd-rcount">{count} ratings</span></>}
    </div>
  );
};

/* ── Main ── */
const ProductDetails = () => {
  const { state: product } = useLocation();
  const navigate = useNavigate();

  const [qty,          setQty]          = useState(1);
  const [pincode,      setPincode]      = useState("");
  const [pinChecked,   setPinChecked]   = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab,    setActiveTab]    = useState("details");
  const [wishlisted,   setWishlisted]   = useState(false);
  const [addedCart,    setAddedCart]    = useState(false);

  /* ── no product guard ── */
  if (!product) {
    return (
      <div className="pd-empty">
        <div className="pd-empty-icon">📦</div>
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist or was removed.</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const imgSrc        = product.image || product.images || "";
  const offer         = getOffer(product.name);
  const rating        = parseFloat(getRating(product.name));
  const reviewCount   = ((product.name?.charCodeAt(0) || 65) * 17 + 42) % 1600 + 300;
  const originalPrice = offer
    ? Math.round(Number(product.price) / (1 - offer / 100))
    : null;

  const subtotal = Number(product.price) * qty;
  const delivery = subtotal > 299 ? 0 : 49;
  const discount = offer ? Math.round((originalPrice - Number(product.price)) * qty) : 0;
  const total    = subtotal + delivery;

  const cartItem = [{
    ...product,
    id:    "pd-item",
    title: product.name,
    image: imgSrc,
    qyt:   qty,
  }];

  /* ── checkout mode ── */
  if (showCheckout) {
    return (
      <Checkout
        cartItems={cartItem}
        subtotal={subtotal}
        delivery={delivery}
        discount={discount}
        total={total}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  const highlights = [
    product.weight   && `Weight / Size: ${product.weight}`,
    product.brand    && `Brand: ${product.brand}`,
    product.category && `Category: ${product.category}`,
    "100% Quality Assured",
    "Easy 7-Day Returns",
    "Hygienically Packed",
  ].filter(Boolean);

  const mockReviews = [
    { name: "Priya M.",   stars: 5, text: "Absolutely fresh! Delivered within the hour. Will order again definitely." },
    { name: "Arun K.",    stars: 4, text: "Good quality product. Packaging was neat and secure." },
    { name: "Divya R.",   stars: 5, text: "Excellent value for money. My go-to store now." },
    { name: "Suresh B.",  stars: 4, text: "Very satisfied with the quality. Fast delivery too." },
  ];

  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* ── Breadcrumb ── */}
        <nav className="pd-breadcrumb">
          <span className="pdb-link" onClick={() => navigate("/")}>Home</span>
          <span className="pdb-sep">›</span>
          <span className="pdb-link" onClick={() => navigate(-1)}>
            {product.category || "Products"}
          </span>
          <span className="pdb-sep">›</span>
          <span className="pdb-active">{product.name}</span>
        </nav>

        {/* ── Main card ── */}
        <div className="pd-card">

          {/* LEFT — image */}
          <div className="pd-img-col">
            <div className="pd-img-box">
              {offer && <span className="pd-offer-pill">{offer}% OFF</span>}
              <img
                src={imgSrc}
                alt={product.name}
                className="pd-img"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/420?text=No+Image")
                }
              />
            </div>

            {/* action buttons under image */}
            <div className="pd-img-actions">
              <button
                className={`pd-action-btn ${wishlisted ? "active-wish" : ""}`}
                onClick={() => setWishlisted((w) => !w)}
              >
                {wishlisted ? "❤️" : "🤍"} {wishlisted ? "Wishlisted" : "Wishlist"}
              </button>
              <button className="pd-action-btn">🔗 Share</button>
            </div>
          </div>

          {/* RIGHT — details */}
          <div className="pd-info-col">

            <span className="pd-cat-chip">{product.category || "General"}</span>
            <h1 className="pd-title">{product.name}</h1>

            {/* rating row */}
            <div className="pd-rating-row">
              <div className="pd-rating-badge">{rating} ★</div>
              <span className="pd-rating-text">{reviewCount} verified ratings</span>
            </div>

            {/* price */}
            <div className="pd-price-row">
              <span className="pd-price">₹{Number(product.price).toFixed(0)}</span>
              {originalPrice && (
                <span className="pd-orig-price">₹{originalPrice}</span>
              )}
              {offer && <span className="pd-off-badge">{offer}% off</span>}
            </div>

            {offer && (
              <div className="pd-savings-strip">
                <span>🎉</span>
                <span>
                  You save <strong>₹{(originalPrice - Number(product.price)) * qty}</strong> on
                  this order — Limited time deal!
                </span>
              </div>
            )}

            {/* offers */}
            <div className="pd-offers-card">
              <p className="pd-offers-heading">🏷️ Available Offers</p>
              <div className="pd-offer-item">
                <span className="pd-offer-dot" />
                <span><b>Bank Offer</b> — 5% unlimited cashback on select cards</span>
              </div>
              <div className="pd-offer-item">
                <span className="pd-offer-dot" />
                <span><b>Special Price</b> — Extra {offer || 10}% off on this item</span>
              </div>
              <div className="pd-offer-item">
                <span className="pd-offer-dot" />
                <span><b>Free Delivery</b> — On all orders above ₹299</span>
              </div>
            </div>

            {/* highlights */}
            {highlights.length > 0 && (
              <div>
                <p className="pd-sec-label">Highlights</p>
                <ul className="pd-highlights">
                  {highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}

            {/* delivery check */}
            <div>
              <p className="pd-sec-label">Check Delivery</p>
              <div className="pd-pin-row">
                <input
                  className="pd-pin-input"
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ""));
                    setPinChecked(false);
                  }}
                />
                <button
                  className="pd-pin-btn"
                  onClick={() => pincode.length === 6 && setPinChecked(true)}
                >
                  Check
                </button>
              </div>
              {pinChecked && (
                <p className="pd-delivery-ok">
                  ✅ Delivery available to {pincode} —{" "}
                  {delivery === 0 ? "FREE delivery!" : `₹${delivery} delivery charge`}
                </p>
              )}
              {!pinChecked && (
                <p className="pd-delivery-hint">
                  {delivery === 0 ? "✅ Free delivery on this order" : `🚚 ₹${delivery} delivery charge applies`}
                </p>
              )}
            </div>

            {/* quantity */}
            <div>
              <p className="pd-sec-label">Quantity</p>
              <div className="pd-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="pd-cta">
              <button
                className={`pd-btn-cart ${addedCart ? "done" : ""}`}
                onClick={() => {
                  setAddedCart(true);
                  setTimeout(() => setAddedCart(false), 1800);
                }}
              >
                {addedCart ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
              <button
                className="pd-btn-buy"
                onClick={() => setShowCheckout(true)}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* trust badges */}
            <div className="pd-trust">
              <div className="pd-trust-item"><span>✅</span><p>Quality<br/>Assured</p></div>
              <div className="pd-trust-item"><span>🔄</span><p>7-Day<br/>Returns</p></div>
              <div className="pd-trust-item"><span>🔒</span><p>Secure<br/>Payment</p></div>
              <div className="pd-trust-item"><span>🚚</span><p>Fast<br/>Delivery</p></div>
            </div>

          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="pd-tabs-section">

          <div className="pd-tab-bar">
            {["details", "reviews"].map((t) => (
              <button
                key={t}
                className={`pd-tab ${activeTab === t ? "pd-tab-active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "details" ? "📋 Product Details" : `⭐ Reviews (${reviewCount})`}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">

            {activeTab === "details" && (
              <>
                <p className="pd-desc">
                  {product.description ||
                    "A premium quality product handpicked for you. Sourced from trusted suppliers, carefully quality-checked before every delivery to ensure you get only the freshest and best."}
                </p>
                <table className="pd-table">
                  <tbody>
                    {product.category && <tr><td>Category</td><td>{product.category}</td></tr>}
                    {product.brand    && <tr><td>Brand</td><td>{product.brand}</td></tr>}
                    {product.weight   && <tr><td>Weight</td><td>{product.weight}</td></tr>}
                    <tr><td>Price</td><td>₹{Number(product.price).toFixed(0)}</td></tr>
                    {originalPrice && <tr><td>MRP</td><td><s>₹{originalPrice}</s></td></tr>}
                    <tr><td>Availability</td><td><span className="pd-instock">✔ In Stock</span></td></tr>
                    <tr><td>Return Policy</td><td>7-day hassle-free returns</td></tr>
                    <tr><td>Delivery</td><td>{delivery === 0 ? "Free" : `₹${delivery}`}</td></tr>
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "reviews" && (
              <>
                <div className="pd-review-summary">
                  <div className="pd-big-rating">{rating}</div>
                  <div>
                    <Stars rating={rating} />
                    <p className="pd-review-total">{reviewCount} verified purchases</p>
                    {/* Rating bars */}
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 62 : star === 4 ? 24 : star === 3 ? 9 : star === 2 ? 3 : 2;
                      return (
                        <div className="pd-bar-row" key={star}>
                          <span className="pd-bar-label">{star}★</span>
                          <div className="pd-bar-track">
                            <div className="pd-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="pd-bar-pct">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pd-reviews">
                  {mockReviews.map((rev, i) => (
                    <div className="pd-review-card" key={i}>
                      <div className="pd-rev-head">
                        <div className="pd-rev-avatar">{rev.name[0]}</div>
                        <div>
                          <p className="pd-rev-name">{rev.name}</p>
                          <p className="pd-rev-stars">
                            {"★".repeat(rev.stars)}{"☆".repeat(5 - rev.stars)}
                          </p>
                        </div>
                        <span className="pd-rev-verified">✔ Verified</span>
                      </div>
                      <p className="pd-rev-text">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;