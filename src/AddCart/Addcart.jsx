import React, { useContext, useState, useEffect } from "react";
import "./Addcart.css";
import Checkout from "../Checkout/Checkout";
import {
  add_cart, cleardata, decrement, deleta_datas,
  increment, price_data, cart_data, user_data, login_control
} from "../App";

const API_MAP = {
  baby:      "https://babycare-tawz.onrender.com/api/",
  pharmacy:  "https://pharmacyapi-1.onrender.com/api/",
  pet:       "https://petcare-byc5.onrender.com/api/",
  ecommerce: "https://ecommerceapidata.onrender.com/api/",
};

const TIPS = [10, 20, 30, 50];

const Addcart = () => {
  const add1        = useContext(add_cart);
  const price1      = useContext(price_data);
  const delete1     = useContext(deleta_datas);
  const incr1       = useContext(increment);
  const decr1       = useContext(decrement);
  const clear1      = useContext(cleardata);
  const addCart     = useContext(cart_data);
  const user        = useContext(user_data);
  const setShowLogin= useContext(login_control);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showCheckout,    setShowCheckout]    = useState(false);
  const [donation,        setDonation]        = useState(false);
  const [tip,             setTip]             = useState(0);
  const [customTip,       setCustomTip]       = useState("");
  const [showCustomTip,   setShowCustomTip]   = useState(false);
  const [showPolicy,      setShowPolicy]      = useState(false);
  const [copied,          setCopied]          = useState(false);

  /* ── charges ── */
  const HANDLING  = 5;
  const DELIVERY  = price1 >= 499 ? 0 : 49;
  const DONATION  = donation ? 1 : 0;
  const TIP_AMT   = showCustomTip ? (parseInt(customTip) || 0) : tip;
  const TOTAL     = price1 + DELIVERY + HANDLING + DONATION + TIP_AMT;
  const SAVINGS   = DELIVERY === 0 ? 49 : 0;

  /* ── detect category ── */
  const detectCategory = (item) => {
    const n = (item.name || "").toLowerCase();
    if (n.includes("pampers") || n.includes("huggies") || n.includes("baby")) return "baby";
    if (n.includes("dog") || n.includes("cat") || n.includes("pet"))           return "pet";
    if (n.includes("tablet") || n.includes("medicine") || n.includes("mg"))    return "pharmacy";
    return "ecommerce";
  };

  const getCategory = () => {
    if (add1.length === 0) return "ecommerce";
    return add1[0].category || detectCategory(add1[0]);
  };

  /* ── fetch related ── */
  useEffect(() => {
    if (add1.length === 0) return;
    const apiUrl = API_MAP[getCategory()];
    fetch(apiUrl)
      .then(r => r.json())
      .then(data => {
        const clean = data.map(item => ({
          id:       (item.id || item._id || item.name).toString(),
          name:     item.name  || item.title,
          price:    item.price || item.cost,
          image:    item.image || item.images,
          category: getCategory(),
        }));
        setRelatedProducts(
          clean.filter(p => !add1.some(c => c.id === p.id)).slice(0, 8)
        );
      })
      .catch(() => {});
  }, [add1]);

  /* ── share cart ── */
  const shareCart = () => {
    const text = add1.map(i => `• ${i.name} x${i.qyt||1} — ₹${i.price*(i.qyt||1)}`).join("\n");
    const msg  = `🛒 My QuickKart cart:\n${text}\n\nTotal: ₹${TOTAL}`;
    if (navigator.share) {
      navigator.share({ title: "My Cart", text: msg });
    } else {
      navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* ── checkout ── */
  const handleCheckout = () => {
    if (!user || Object.keys(user).length === 0) {
      alert("Please login to continue");
      setShowLogin(true);
      return;
    }
    setShowCheckout(true);
  };

  const itemCount = add1.reduce((s, i) => s + (i.qyt || 1), 0);

  if (showCheckout) {
    return (
      <Checkout
        cartItems={add1}
        subtotal={price1}
        delivery={DELIVERY}
        discount={0}
        total={TOTAL}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  /* ─────────── EMPTY CART ─────────── */
  if (add1.length === 0) {
    return (
      <div className="cp-empty">
        <div className="cp-empty__box">
          <div className="cp-empty__icon">🛒</div>
          <h2>Your cart is empty!</h2>
          <p>Add items from our store to get started.</p>
          <a href="/Products" className="cp-empty__btn">Browse Products</a>
        </div>
      </div>
    );
  }

  /* ─────────── MAIN CART ─────────── */
  return (
    <div className="cp">
      <div className="cp__inner">

        {/* ── PAGE HEADER ── */}
        <div className="cp__header">
          <div>
            <h1 className="cp__title">My Cart</h1>
            <span className="cp__sub">{itemCount} item{itemCount !== 1 ? "s" : ""} · {add1.length} product{add1.length !== 1 ? "s" : ""}</span>
          </div>
          {SAVINGS > 0 && (
            <div className="cp__savings">
              🎉 You save ₹{SAVINGS} on this order!
            </div>
          )}
        </div>

        <div className="cp__layout">

          {/* ══════════ LEFT COLUMN ══════════ */}
          <div className="cp__left">

            {/* DELIVERY INFO STRIP */}
            <div className="cp__delivery-strip">
              <span className="ds__icon">⚡</span>
              <div>
                <strong>Delivery in 8–30 minutes</strong>
                <span className="ds__addr"> · Delivering to your saved address</span>
              </div>
              {DELIVERY === 0
                ? <span className="ds__free">FREE delivery</span>
                : <span className="ds__paid">Add ₹{499 - price1} more for free delivery</span>
              }
            </div>

            {/* CART ITEMS */}
            <div className="cp__items-card">
              <div className="cp__items-head">
                <span>🛍️ Items in your cart</span>
                <button className="cp__clear-link" onClick={clear1}>Clear all</button>
              </div>

              {add1.map((item, index) => {
                const qty = item.qyt || 1;
                return (
                  <div className="cp__item" key={item.id || index}>
                    <div className="cp__item-img-wrap">
                      <img src={item.image} alt={item.name} className="cp__item-img" />
                    </div>

                    <div className="cp__item-body">
                      <h3 className="cp__item-name">{item.name}</h3>
                      <p className="cp__item-unit">₹{item.price} per unit</p>
                      {item.category && (
                        <span className="cp__item-tag">{item.category}</span>
                      )}
                    </div>

                    <div className="cp__item-right">
                      <div className="cp__qty">
                        <button className="cp__qty-btn" onClick={() => decr1(index)}>−</button>
                        <span className="cp__qty-val">{qty}</span>
                        <button className="cp__qty-btn cp__qty-btn--plus" onClick={() => incr1(index)}>+</button>
                      </div>
                      <div className="cp__item-price">₹{item.price * qty}</div>
                      <button className="cp__remove" onClick={() => delete1(index)}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── TIP YOUR DELIVERY PARTNER ── */}
            <div className="cp__card cp__tip-card">
              <div className="cp__card-header">
                <span className="cp__card-icon">🏍️</span>
                <div>
                  <h4>Tip your delivery partner</h4>
                  <p>Show your appreciation with a tip. 100% goes to them.</p>
                </div>
              </div>
              <div className="cp__tip-options">
                {TIPS.map(t => (
                  <button
                    key={t}
                    className={`cp__tip-btn${tip === t && !showCustomTip ? " cp__tip-btn--active" : ""}`}
                    onClick={() => { setTip(t); setShowCustomTip(false); setCustomTip(""); }}
                  >
                    ₹{t}
                  </button>
                ))}
                <button
                  className={`cp__tip-btn${showCustomTip ? " cp__tip-btn--active" : ""}`}
                  onClick={() => { setShowCustomTip(true); setTip(0); }}
                >
                  Custom
                </button>
              </div>
              {showCustomTip && (
                <input
                  className="cp__tip-input"
                  type="number"
                  placeholder="Enter tip amount..."
                  value={customTip}
                  onChange={e => setCustomTip(e.target.value)}
                  autoFocus
                  min="0"
                />
              )}
              {(TIP_AMT > 0) && (
                <p className="cp__tip-thankyou">
                  🙏 Thank you for tipping ₹{TIP_AMT}!
                </p>
              )}
            </div>

            {/* ── YOU MIGHT ALSO LIKE ── */}
            {relatedProducts.length > 0 && (
              <div className="cp__card cp__related-card">
                <div className="cp__card-header">
                  <span className="cp__card-icon">✨</span>
                  <h4>You might also like</h4>
                </div>
                <div className="cp__related-grid">
                  {relatedProducts.map(p => (
                    <div className="cp__related-item" key={p.id}>
                      <img src={p.image} alt={p.name} />
                      <div className="cp__related-body">
                        <p className="cp__related-name">{p.name}</p>
                        <span className="cp__related-price">₹{p.price}</span>
                        <button className="cp__related-add" onClick={() => addCart(p)}>
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ══════════ RIGHT COLUMN ══════════ */}
          <div className="cp__right">

            {/* ── BILL DETAILS ── */}
            <div className="cp__card cp__bill-card">
              <div className="cp__bill-head">
                <span>🧾</span>
                <h4>Bill Details</h4>
              </div>

              <div className="cp__bill-rows">
                <div className="cp__bill-row">
                  <span>Item total</span>
                  <span>₹{price1}</span>
                </div>
                <div className="cp__bill-row">
                  <span>Delivery fee
                    {DELIVERY === 0 && <span className="cp__strike"> ₹49</span>}
                  </span>
                  <span className={DELIVERY === 0 ? "cp__green" : ""}>
                    {DELIVERY === 0 ? "FREE" : `₹${DELIVERY}`}
                  </span>
                </div>
                <div className="cp__bill-row">
                  <span>
                    Handling charge
                    <span className="cp__info-tip" title="Covers packaging, quality checks & safe handling">ⓘ</span>
                  </span>
                  <span>₹{HANDLING}</span>
                </div>

                {TIP_AMT > 0 && (
                  <div className="cp__bill-row">
                    <span>Delivery partner tip 🏍️</span>
                    <span>₹{TIP_AMT}</span>
                  </div>
                )}

                {/* FEEDING INDIA */}
                <div className="cp__bill-row cp__bill-row--donation">
                  <label className="cp__donation-label">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Feeding_India_Logo.png/220px-Feeding_India_Logo.png"
                      alt="Feeding India"
                      className="cp__donation-logo"
                      onError={e => { e.target.style.display='none'; }}
                    />
                    <div>
                      <span className="cp__donation-name">Feeding India donation</span>
                      <span className="cp__donation-sub">Contribute ₹1 to fight hunger</span>
                    </div>
                  </label>
                  <label className="cp__toggle">
                    <input type="checkbox" checked={donation} onChange={() => setDonation(v => !v)} />
                    <span className="cp__toggle-slider" />
                  </label>
                </div>

                {DONATION > 0 && (
                  <div className="cp__bill-row cp__bill-row--green">
                    <span>Feeding India 💚</span>
                    <span>₹{DONATION}</span>
                  </div>
                )}
              </div>

              <div className="cp__bill-divider" />

              <div className="cp__bill-total">
                <span>To pay</span>
                <span>₹{TOTAL}</span>
              </div>

              {SAVINGS > 0 && (
                <div className="cp__savings-badge">
                  🎉 Your total savings on this order: ₹{SAVINGS}
                </div>
              )}
            </div>

            {/* ── ACTIONS ── */}
            <div className="cp__actions-card">
              <button className="cp__checkout-btn" onClick={handleCheckout}>
                <span>Proceed to Checkout</span>
                <span className="cp__checkout-total">₹{TOTAL} →</span>
              </button>

              <button className="cp__share-btn" onClick={shareCart}>
                {copied
                  ? <><span>✅</span> Copied to clipboard!</>
                  : <><span>🔗</span> Share this cart</>
                }
              </button>
            </div>

            {/* ── CANCELLATION POLICY ── */}
            <div className="cp__policy-card">
              <button
                className="cp__policy-toggle"
                onClick={() => setShowPolicy(v => !v)}
              >
                <span>📋 Cancellation Policy</span>
                <svg
                  className={`cp__chevron${showPolicy ? " cp__chevron--up" : ""}`}
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {showPolicy && (
                <div className="cp__policy-body">
                  <p>Orders cannot be cancelled once the delivery partner picks up your order. For orders cancelled before pickup, a full refund will be issued.</p>
                  <ul>
                    <li>100% refund if cancelled before dispatch</li>
                    <li>No cancellation once order is out for delivery</li>
                    <li>Damaged/wrong items: raise a complaint within 24 hrs</li>
                    <li>Refunds processed in 5–7 business days</li>
                  </ul>
                </div>
              )}
            </div>

            {/* ── TRUST BADGES ── */}
            <div className="cp__trust">
              <div className="cp__trust-item">
                <span>🔐</span>
                <span>100% Secure</span>
              </div>
              <div className="cp__trust-sep" />
              <div className="cp__trust-item">
                <span>↩️</span>
                <span>Easy Returns</span>
              </div>
              <div className="cp__trust-sep" />
              <div className="cp__trust-item">
                <span>⚡</span>
                <span>Fast Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Addcart;