import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Buynow.css";
import Checkout from "../Checkout/Checkout";

/* ── helpers (same as Products page) ── */
const OFFERS = [10, 15, 18, 20, 25, 30, 35, 40];

const getOffer = (name) => {
  if (!name) return null;
  const code = name.charCodeAt(0) + name.length;
  return OFFERS[code % OFFERS.length];
};

const getRating = (name) => {
  if (!name) return "4.0";
  return (3.5 + (name.charCodeAt(0) % 15) / 10).toFixed(1);
};

/* ── Star Rating ── */
const StarRating = ({ rating, count }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="buy-stars">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={
            i < full ? "bstar filled" : i === full && half ? "bstar half" : "bstar"
          }
        >
          ★
        </span>
      ))}
      <span className="brating-val">{rating}</span>
      <span className="brating-sep">|</span>
      <span className="brating-count">{count} Ratings</span>
    </div>
  );
};

/* ── Main Component ── */
const Buynow = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const product   = location.state;

  const [qty,          setQty]          = useState(1);
  const [pincode,      setPincode]      = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeTab,    setActiveTab]    = useState("details");
  const [wishlisted,   setWishlisted]   = useState(false);

  /* ── empty guard ── */
  if (!product) {
    return (
      <div className="buy-empty">
        <span>😕</span>
        <p>Product not found</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  const imgSrc        = product.image || product.images || "";
  const offer         = getOffer(product.name);
  const rating        = parseFloat(getRating(product.name));
  const reviewCount   = ((product.name?.charCodeAt(0) || 65) * 17 + 42) % 1800 + 200;
  const originalPrice = offer
    ? Math.round(Number(product.price) / (1 - offer / 100))
    : null;

  const subtotal = Number(product.price) * qty;
  const delivery = subtotal > 299 ? 0 : 40;
  const discount = offer ? Math.round((originalPrice - Number(product.price)) * qty) : 0;
  const total    = subtotal + delivery;

  const cartItem = [{
    ...product,
    id:    "buy-item",
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
    product.weight   && `Weight: ${product.weight}`,
    product.brand    && `Brand: ${product.brand}`,
    product.category && `Category: ${product.category}`,
    "Quality Assured",
    "Easy Returns within 7 days",
  ].filter(Boolean);

  const mockReviews = [
    { user: "Priya M.",  text: "Excellent quality! Very fresh and delivered on time.", stars: 5 },
    { user: "Arun K.",   text: "Good product overall, packaging could be a little better.", stars: 4 },
    { user: "Sunita R.", text: "Worth every rupee. Will definitely order again.", stars: 4 },
  ];

  return (
    <div className="buy-page">
      <div className="buy-container">

        {/* ── Breadcrumb ── */}
        <div className="buy-breadcrumb">
          <span className="bc-link" onClick={() => navigate("/")}>Home</span>
          <span className="bc-sep">›</span>
          <span className="bc-link" onClick={() => navigate(-1)}>
            {product.category || "Products"}
          </span>
          <span className="bc-sep">›</span>
          <span className="bc-current">{product.name}</span>
        </div>

        {/* ── Main grid ── */}
        <div className="buy-grid">

          {/* LEFT — Image */}
          <div className="buy-image-panel">
            <div className="buy-img-wrap">
              {offer && <span className="buy-offer-tag">{offer}% OFF</span>}
              <img
                src={imgSrc}
                alt={product.name}
                className="buy-main-img"
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/420?text=No+Image")
                }
              />
            </div>
            <div className="buy-img-btns">
              <button
                className={`buy-img-btn ${wishlisted ? "wishlisted" : ""}`}
                onClick={() => setWishlisted((w) => !w)}
              >
                {wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
              </button>
              <button className="buy-img-btn">🔗 Share</button>
            </div>
          </div>

          {/* RIGHT — Info */}
          <div className="buy-info-panel">

            <p className="buy-cat-label">{product.category || "General"}</p>
            <h1 className="buy-name">{product.name}</h1>

            <StarRating rating={rating} count={reviewCount} />

            {/* Price */}
            <div className="buy-price-block">
              <span className="buy-price">₹{Number(product.price).toFixed(0)}</span>
              {originalPrice && (
                <span className="buy-orig">₹{originalPrice}</span>
              )}
              {offer && (
                <span className="buy-pct-off">{offer}% off</span>
              )}
            </div>
            {offer && (
              <div className="buy-savings">
                🎉 You save ₹{(originalPrice - Number(product.price)) * qty} on this order
              </div>
            )}

            {/* Offers */}
            <div className="buy-offers-box">
              <p className="buy-offers-title">Available Offers</p>
              <p className="buy-offer-row">🏷️ <b>Bank Offer</b> — 5% cashback on select cards</p>
              <p className="buy-offer-row">🎁 <b>Special Price</b> — Extra {offer || 10}% off today</p>
              <p className="buy-offer-row">🚚 <b>Free Delivery</b> — On orders above ₹299</p>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="buy-highlights">
                <p className="buy-sec-label">Highlights</p>
                <ul className="buy-hl-list">
                  {highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}

            {/* Delivery check */}
            <div>
              <p className="buy-sec-label" style={{ marginBottom: 8 }}>Check Delivery</p>
              <div className="pin-row">
                <input
                  className="pin-input"
                  placeholder="Enter pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                />
                <button className="pin-btn">Check</button>
              </div>
              <p className="delivery-note">
                {delivery === 0
                  ? "✅ Free delivery on this order"
                  : `🚚 Delivery charges: ₹${delivery}`}
              </p>
            </div>

            {/* Qty selector */}
            <div>
              <p className="buy-sec-label" style={{ marginBottom: 8 }}>Quantity</p>
              <div className="qty-ctrl">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="buy-cta-row">
              <button className="btn-cart">🛒 Add to Cart</button>
              <button className="btn-buy" onClick={() => setShowCheckout(true)}>
                ⚡ Buy Now
              </button>
            </div>

            {/* Assurance strip */}
            <div className="buy-assurance">
              <div className="assurance-item"><span>✅</span>Quality Assured</div>
              <div className="assurance-item"><span>🔄</span>7-Day Returns</div>
              <div className="assurance-item"><span>🔒</span>Secure Payment</div>
              <div className="assurance-item"><span>🚚</span>Fast Delivery</div>
            </div>

          </div>
        </div>

        {/* ── Tabs section ── */}
        <div className="buy-tabs-section">

          <div className="buy-tabs">
            {["details", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`buy-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "details" ? "Product Details" : "Customer Reviews"}
              </button>
            ))}
          </div>

          <div className="buy-tab-body">

            {/* Details tab */}
            {activeTab === "details" && (
              <>
                <p className="buy-description">
                  {product.description ||
                    "This is a high-quality product carefully selected to ensure your satisfaction. Sourced from trusted suppliers and quality-checked before every delivery."}
                </p>
                <table className="buy-specs-table">
                  <tbody>
                    {product.category && (
                      <tr><td>Category</td><td>{product.category}</td></tr>
                    )}
                    {product.brand && (
                      <tr><td>Brand</td><td>{product.brand}</td></tr>
                    )}
                    {product.weight && (
                      <tr><td>Weight</td><td>{product.weight}</td></tr>
                    )}
                    <tr>
                      <td>Price</td>
                      <td>₹{Number(product.price).toFixed(0)}</td>
                    </tr>
                    <tr>
                      <td>Availability</td>
                      <td><span className="in-stock">✔ In Stock</span></td>
                    </tr>
                    <tr>
                      <td>Return Policy</td>
                      <td>7-day easy returns</td>
                    </tr>
                    <tr>
                      <td>Delivery</td>
                      <td>{delivery === 0 ? "Free" : `₹${delivery}`}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <>
                <div className="reviews-summary">
                  <div className="reviews-big-num">{rating}</div>
                  <div>
                    <StarRating rating={rating} count={reviewCount} />
                    <p className="reviews-sub">{reviewCount} verified purchases</p>
                  </div>
                </div>
                <div className="review-list">
                  {mockReviews.map((rev, i) => (
                    <div className="review-card" key={i}>
                      <div className="rev-head">
                        <div className="rev-avatar">{rev.user[0]}</div>
                        <div>
                          <p className="rev-user">{rev.user}</p>
                          <p className="rev-stars">
                            {"★".repeat(rev.stars)}{"☆".repeat(5 - rev.stars)}
                          </p>
                        </div>
                      </div>
                      <p className="rev-text">{rev.text}</p>
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

export default Buynow;