// FILE: src/Checkout/Checkout.jsx
import React, { useState, useContext, useEffect } from "react";
import "./Checkout.css";
import { useRazorpay } from "../hooks/useRazorpay";
import { user_data, cleardata } from "../App";

/* ── helpers ────────────────────────────────────────────── */
const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Chandigarh","Puducherry",
];

const parseNavLocation = (locStr) => {
  if (!locStr || locStr === "Detecting location...") return null;
  const parts = locStr.split(",").map(s => s.trim());
  return { area: parts[0] || "", city: parts[1] || "", state: parts[2] || "" };
};

const PAYMENT_METHODS = [
  { id: "razorpay", icon: "💳", name: "Pay Online",       desc: "UPI, Cards, Net Banking via Razorpay" },
  { id: "cod",      icon: "💵", name: "Cash on Delivery", desc: "Pay when you receive your order" },
];

const STEPS = ["Address", "Payment", "Review"];

const ADDR_TAGS = ["Home", "Work", "Hotel", "Other"];

/* ══════════════════════════════════════════════════════════
   CHECKOUT COMPONENT
══════════════════════════════════════════════════════════ */
const Checkout = ({ cartItems, subtotal, delivery, discount, total, onBack }) => {
  const user   = useContext(user_data);
  const clear1 = useContext(cleardata);

  const { initiatePayment, loading, error: payError, orderStatus, orderId } = useRazorpay();

  /* ─── ALL useState at the TOP — never after conditional returns ─── */
  const [step,          setStep]          = useState(0);
  const [addresses,     setAddresses]     = useState(() => buildDefaultAddresses(user));
  const [selAddrId,     setSelAddrId]     = useState(() => buildDefaultAddresses(user)[0]?.id || null);
  const [showNewAddr,   setShowNewAddr]   = useState(false);
  const [newAddr,       setNewAddr]       = useState({
    tag: "Home", name: user?.name || "", phone: user?.phone || "",
    flat: "", floor: "", area: "", landmark: "", city: "", state: "", pin: "",
  });
  const [navPin,        setNavPin]        = useState("");
  const [navPinError,   setNavPinError]   = useState("");
  const [selPay,        setSelPay]        = useState("razorpay");
  const [localError,    setLocalError]    = useState("");
  const [coupon,        setCoupon]        = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMsg,     setCouponMsg]     = useState("");
  const [codPlaced,     setCodPlaced]     = useState(false);   // ← FIXED: moved to top

  /* ─── Re-seed addresses when user logs in mid-session ─── */
  useEffect(() => {
    if (user) {
      setAddresses(prev => prev.map(a =>
        a.fromNav ? { ...a, name: user.name || a.name, phone: user.phone || a.phone } : a
      ));
    }
  }, [user]);

  const selectedAddr = addresses.find(a => a.id === selAddrId);

  /* ── Coupon ── */
  const VALID_COUPONS = { FIRST20: 0.20, HEALTH30: 0.30, SAVE100: 100, PETLOVE: 150 };
  const applyCoupon = () => {
    const key = coupon.trim().toUpperCase();
    if (VALID_COUPONS[key]) {
      setCouponApplied(true);
      setCouponMsg(`✅ Coupon "${key}" applied!`);
    } else {
      setCouponApplied(false);
      setCouponMsg("❌ Invalid coupon code.");
    }
    setTimeout(() => setCouponMsg(""), 3000);
  };

  /* ── Save order to localStorage ── */
  const saveOrderToHistory = (oid) => {
    const existing = JSON.parse(localStorage.getItem("myshop_orders") || "[]");
    const addr = selectedAddr || {};
    const newOrder = {
      id:            oid || "ORD" + Date.now().toString().slice(-8).toUpperCase(),
      date:          new Date().toISOString(),
      status:        "SUCCESS",
      total,
      delivery,
      paymentMethod: selPay === "razorpay" ? "Online" : "COD",
      address:       addr.full || addr.line1 || "",
      items: cartItems.map(i => ({
        name:     i.name     || i.title || "",
        price:    i.price,
        quantity: i.qyt      || 1,
        image:    i.image    || i.images || "",
        category: i.category || "",
      })),
    };
    localStorage.setItem("myshop_orders", JSON.stringify([newOrder, ...existing]));
  };

  /* ── Save new address ── */
  const handleSaveAddr = () => {
    const { name, flat, area, city, pin, tag, phone } = newAddr;
    if (!name.trim())       { setLocalError("Name is required.");            return; }
    if (!flat.trim())       { setLocalError("Flat/House no is required.");   return; }
    if (!area.trim())       { setLocalError("Area/Locality is required.");   return; }
    if (!city.trim())       { setLocalError("City is required.");            return; }
    if (pin.length !== 6)   { setLocalError("Enter a valid 6-digit PIN.");   return; }

    const fullStr = `${flat}${newAddr.floor ? ", " + newAddr.floor : ""}, ${area}, ${city}${newAddr.state ? ", " + newAddr.state : ""} - ${pin}`;
    const entry = {
      id: Date.now(),
      tag, name, phone,
      flat, floor: newAddr.floor, area, landmark: newAddr.landmark,
      city, state: newAddr.state, pin,
      full: fullStr,
      fromNav: false,
    };
    const updated = [...addresses, entry];
    setAddresses(updated);
    setSelAddrId(entry.id);
    setShowNewAddr(false);
    setNewAddr({ tag: "Home", name: user?.name || "", phone: user?.phone || "", flat: "", floor: "", area: "", landmark: "", city: "", state: "", pin: "" });
    setLocalError("");

    const existing = JSON.parse(localStorage.getItem("myshop_addresses") || "[]");
    localStorage.setItem("myshop_addresses", JSON.stringify([...existing, entry]));
  };

  /* ── Step 0 → Step 1 validation ── */
  const handleContinueToPayment = () => {
    if (!selectedAddr) { setLocalError("Please select a delivery address."); return; }

    if (selectedAddr.fromNav) {
      if (navPin.length === 0) {
        setNavPinError("PIN code is required for delivery.");
        setLocalError("Please enter your PIN code.");
        return;
      }
      if (navPin.length !== 6) {
        setNavPinError("PIN must be exactly 6 digits.");
        setLocalError("Enter a valid 6-digit PIN code.");
        return;
      }
      // Patch PIN into the navbar address
      setAddresses(prev => prev.map(a =>
        a.id === selAddrId
          ? { ...a, pin: navPin, full: `${a.full} - ${navPin}` }
          : a
      ));
    }

    setNavPinError("");
    setLocalError("");
    setStep(1);
  };

  /* ── Final place order ── */
  const handlePlaceOrderFinal = async () => {
    setLocalError("");
    if (!selectedAddr) { setLocalError("Please select a delivery address."); return; }

    if (selPay === "cod") {
      saveOrderToHistory(null);
      clear1();
      setCodPlaced(true);
      return;
    }

    await initiatePayment({
      cartItems,
      deliveryAddress: selectedAddr.full || `${selectedAddr.flat || selectedAddr.line1}, ${selectedAddr.city}`,
      deliveryCharge:  delivery,
      userName:  user?.name  || selectedAddr.name,
      userEmail: user?.email || "",
      userPhone: user?.phone || selectedAddr.phone,
      onSuccess: (oid) => { saveOrderToHistory(oid); clear1(); },
      onFailure: (reason) => {
        setLocalError(typeof reason === "string" ? reason : reason?.description || "Payment failed.");
      },
    });
  };

  /* ════════════════════════════════
     SUCCESS / FAIL / COD SCREENS
  ════════════════════════════════ */
  if (codPlaced || orderStatus === "SUCCESS") {
    return (
      <div className="co-page">
        <div className="co-result-card">
          <div className="co-result-icon success-icon">✓</div>
          <h2 className="co-result-title">
            {selPay === "cod" ? "Order Placed! 🎉" : "Order Confirmed! 🎉"}
          </h2>
          <p className="co-result-sub">
            {selPay === "cod"
              ? "Your Cash on Delivery order is confirmed. Pay when it arrives!"
              : "Your payment was successful. Your order is on its way!"}
          </p>
          {orderId && (
            <div className="co-order-id">Order ID: #{String(orderId).slice(-8).toUpperCase()}</div>
          )}
          <div className="co-result-actions">
            <button className="co-res-btn primary" onClick={onBack}>Continue Shopping</button>
            <a href="/orders" className="co-res-btn secondary">View Orders</a>
          </div>
        </div>
      </div>
    );
  }

  if (orderStatus === "FAILED") {
    return (
      <div className="co-page">
        <div className="co-result-card">
          <div className="co-result-icon fail-icon">✕</div>
          <h2 className="co-result-title">Payment Failed</h2>
          <p className="co-result-sub">{payError || "Your payment could not be processed. Please try again."}</p>
          <div className="co-result-actions">
            <button className="co-res-btn primary" onClick={() => setStep(2)}>Try Again</button>
            <button className="co-res-btn secondary" onClick={onBack}>Back to Cart</button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════
     MAIN CHECKOUT UI
  ════════════════════════════════ */
  return (
    <div className="co-page">
      <div className="co-inner">

        {/* TOP BAR */}
        <div className="co-topbar">
          <button className="co-back-btn" onClick={onBack}>← Back to Cart</button>
          <h1 className="co-title">Checkout</h1>
          <div className="co-secure-tag">🔒 100% Secure</div>
        </div>

        {/* STEP BAR */}
        <div className="co-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`co-step ${i === step ? "co-step-active" : ""} ${i < step ? "co-step-done" : ""}`}
                onClick={() => i < step && setStep(i)}
                style={{ cursor: i < step ? "pointer" : "default" }}
              >
                <div className="co-step-num">{i < step ? "✓" : i + 1}</div>
                <span>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`co-step-line ${i < step ? "co-step-line-done" : ""}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="co-body">

          {/* ══ LEFT PANEL ══ */}
          <div className="co-left">

            {/* ─── STEP 0: ADDRESS ─── */}
            {step === 0 && (
              <div className="co-panel">
                <div className="co-panel-title"><span>📍</span> Select Delivery Address</div>

                {addresses.find(a => a.fromNav) && (
                  <div className="co-nav-loc-info">
                    <span>📡</span>
                    <span>Delivery location from navbar: <strong>{localStorage.getItem("userLocation")}</strong></span>
                  </div>
                )}

                {/* Address cards */}
                <div className="co-addr-list">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      className={`co-addr-card ${selAddrId === addr.id ? "co-addr-selected" : ""}`}
                      onClick={() => { setSelAddrId(addr.id); setLocalError(""); setNavPinError(""); }}
                    >
                      <div className="co-addr-radio">
                        <div className={`co-radio-outer ${selAddrId === addr.id ? "co-radio-on" : ""}`}>
                          {selAddrId === addr.id && <div className="co-radio-inner" />}
                        </div>
                      </div>
                      <div className="co-addr-body">
                        <div className="co-addr-top">
                          <span className="co-addr-tag">{addr.tag}</span>
                          {addr.fromNav && <span className="co-addr-nav-badge">📍 Current Location</span>}
                        </div>
                        <div className="co-addr-name">{addr.name}</div>
                        <div className="co-addr-line">
                          {addr.full || `${addr.flat || addr.line1}${addr.floor ? ", " + addr.floor : ""}, ${addr.area || addr.city}, ${addr.city}${addr.state ? ", " + addr.state : ""} - ${addr.pin}`}
                        </div>
                        {addr.landmark && <div className="co-addr-landmark">🏪 Near {addr.landmark}</div>}
                        {addr.phone && <div className="co-addr-phone">📞 {addr.phone}</div>}

                        {/* PIN prompt for navbar address */}
                        {addr.fromNav && selAddrId === addr.id && !addr.pin && (
                          <div className="co-pin-prompt" onClick={e => e.stopPropagation()}>
                            <label className="co-pin-label">PIN Code *</label>
                            <input
                              className={`co-pin-input ${navPinError ? "input-error" : ""}`}
                              placeholder="Enter 6-digit PIN code"
                              value={navPin}
                              maxLength={6}
                              inputMode="numeric"
                              onChange={e => {
                                const v = e.target.value.replace(/\D/g, "");
                                setNavPin(v);
                                if (v.length === 6) setNavPinError("");
                              }}
                            />
                            {navPinError
                              ? <span className="co-pin-error">{navPinError}</span>
                              : navPin.length > 0 && navPin.length < 6
                                ? <span className="co-pin-hint">{6 - navPin.length} more digits needed</span>
                                : <span className="co-pin-note">Required for delivery</span>
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new address — Blinkit style, inline */}
                <button
                  className="co-add-addr-btn"
                  onClick={() => { setShowNewAddr(!showNewAddr); setLocalError(""); }}
                >
                  {showNewAddr ? "✕ Cancel" : "+ Add New Address"}
                </button>

                {showNewAddr && (
                  <div className="co-new-addr-form">
                    <div className="co-panel-title" style={{ fontSize: "14px", marginBottom: "16px" }}>
                      Enter complete address
                    </div>

                    {/* Address type tabs */}
                    <div className="co-tag-row">
                      {ADDR_TAGS.map(t => (
                        <button
                          key={t}
                          className={`co-tag-btn ${newAddr.tag === t ? "co-tag-active" : ""}`}
                          onClick={() => setNewAddr({ ...newAddr, tag: t })}
                        >
                          {t === "Home" ? "🏠" : t === "Work" ? "🏢" : t === "Hotel" ? "🏨" : "📍"} {t}
                        </button>
                      ))}
                    </div>

                    <div className="co-form-group co-form-full">
                      <label>Flat / House no / Building name *</label>
                      <input
                        placeholder="e.g. Flat 2B, Sunrise Apartments"
                        value={newAddr.flat}
                        onChange={e => setNewAddr({ ...newAddr, flat: e.target.value })}
                      />
                    </div>

                    <div className="co-form-group co-form-full">
                      <label>Floor (optional)</label>
                      <input
                        placeholder="e.g. 2nd floor, Ground floor"
                        value={newAddr.floor}
                        onChange={e => setNewAddr({ ...newAddr, floor: e.target.value })}
                      />
                    </div>

                    <div className="co-form-group co-form-full">
                      <label>Area / Sector / Locality *</label>
                      <input
                        placeholder="e.g. Koramangala, Sector 5"
                        value={newAddr.area}
                        onChange={e => setNewAddr({ ...newAddr, area: e.target.value })}
                      />
                    </div>

                    <div className="co-form-group co-form-full">
                      <label>Nearby landmark (optional)</label>
                      <input
                        placeholder="e.g. Near Apollo Hospital"
                        value={newAddr.landmark}
                        onChange={e => setNewAddr({ ...newAddr, landmark: e.target.value })}
                      />
                    </div>

                    <div className="co-form-row">
                      <div className="co-form-group">
                        <label>City *</label>
                        <input
                          placeholder="City"
                          value={newAddr.city}
                          onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                        />
                      </div>
                      <div className="co-form-group">
                        <label>PIN Code *</label>
                        <input
                          placeholder="6-digit PIN"
                          value={newAddr.pin}
                          maxLength={6}
                          inputMode="numeric"
                          className={newAddr.pin.length > 0 && newAddr.pin.length < 6 ? "input-error" : ""}
                          onChange={e => setNewAddr({ ...newAddr, pin: e.target.value.replace(/\D/g, "") })}
                        />
                        {newAddr.pin.length > 0 && newAddr.pin.length < 6 && (
                          <span className="co-field-hint">{6 - newAddr.pin.length} more digits</span>
                        )}
                      </div>
                    </div>

                    <div className="co-form-group co-form-full">
                      <label>State</label>
                      <select value={newAddr.state} onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}>
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="co-form-divider">Your details for seamless delivery</div>

                    <div className="co-form-row">
                      <div className="co-form-group">
                        <label>Your name *</label>
                        <input
                          placeholder="Full name"
                          value={newAddr.name}
                          onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
                        />
                      </div>
                      <div className="co-form-group">
                        <label>Phone number</label>
                        <input
                          placeholder="10-digit number"
                          value={newAddr.phone}
                          maxLength={10}
                          inputMode="numeric"
                          onChange={e => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, "") })}
                        />
                      </div>
                    </div>

                    {localError && <div className="co-error">{localError}</div>}
                    <button className="co-save-addr-btn" onClick={handleSaveAddr}>
                      Save Address
                    </button>
                  </div>
                )}

                {localError && !showNewAddr && <div className="co-error">{localError}</div>}

                <button className="co-continue-btn" onClick={handleContinueToPayment}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ─── STEP 1: PAYMENT ─── */}
            {step === 1 && (
              <div className="co-panel">
                <div className="co-panel-title"><span>💳</span> Payment Method</div>

                <div className="co-pay-list">
                  {PAYMENT_METHODS.map(pm => (
                    <div
                      key={pm.id}
                      className={`co-pay-card ${selPay === pm.id ? "co-pay-selected" : ""}`}
                      onClick={() => setSelPay(pm.id)}
                    >
                      <div className="co-pay-left">
                        <span className="co-pay-icon">{pm.icon}</span>
                        <div>
                          <div className="co-pay-name">{pm.name}</div>
                          <div className="co-pay-desc">{pm.desc}</div>
                        </div>
                      </div>
                      <div className="co-radio-outer" style={{ marginLeft: "auto" }}>
                        {selPay === pm.id && <div className="co-radio-inner" />}
                      </div>
                    </div>
                  ))}
                </div>

                {selPay === "razorpay" && (
                  <div className="co-razorpay-note">
                    🔒 Secure payment powered by Razorpay — UPI, Cards, Net Banking & Wallets
                  </div>
                )}

                {/* Coupon */}
                <div className="co-coupon-box">
                  <div className="co-coupon-title">🎟 Apply Coupon</div>
                  <div className="co-coupon-row">
                    <input
                      className="co-coupon-input"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === "Enter" && applyCoupon()}
                    />
                    <button className="co-coupon-btn" onClick={applyCoupon}>Apply</button>
                  </div>
                  {couponMsg
                    ? <p className="co-coupon-msg">{couponMsg}</p>
                    : <p className="co-coupon-hint">Try: FIRST20 · HEALTH30 · PETLOVE · SAVE100</p>
                  }
                </div>

                <button className="co-continue-btn" onClick={() => setStep(2)}>
                  Review Order →
                </button>
              </div>
            )}

            {/* ─── STEP 2: REVIEW ─── */}
            {step === 2 && (
              <div className="co-panel">
                <div className="co-panel-title"><span>📋</span> Review & Place Order</div>

                <div className="co-review-section">
                  <div className="co-review-label">📍 Delivering to</div>
                  <div className="co-review-value">
                    <strong>{selectedAddr?.name}</strong>
                    {" — "}
                    {selectedAddr?.full || `${selectedAddr?.flat || selectedAddr?.line1}, ${selectedAddr?.city}`}
                    {selectedAddr?.pin && !selectedAddr?.full?.includes(selectedAddr.pin) && ` - ${selectedAddr.pin}`}
                    <button className="co-review-change" onClick={() => setStep(0)}>Change</button>
                  </div>
                  {selectedAddr?.phone && (
                    <div className="co-review-sub">📞 {selectedAddr.phone}</div>
                  )}
                </div>

                <div className="co-review-section">
                  <div className="co-review-label">💳 Payment via</div>
                  <div className="co-review-value">
                    {PAYMENT_METHODS.find(p => p.id === selPay)?.name}
                    {couponApplied && <span className="co-coupon-applied-tag">🎟 {coupon}</span>}
                    <button className="co-review-change" onClick={() => setStep(1)}>Change</button>
                  </div>
                </div>

                <div className="co-review-section">
                  <div className="co-review-label">📦 Items ({cartItems.length})</div>
                  <div className="co-review-items">
                    {cartItems.map((item, i) => (
                      <div key={i} className="co-review-item">
                        <img
                          src={item.image || item.images}
                          alt={item.name || item.title}
                          onError={e => { e.target.src = "https://placehold.co/48x48?text=?"; }}
                        />
                        <div className="co-review-item-name">{item.name || item.title}</div>
                        <div className="co-review-item-qty">× {item.qyt || 1}</div>
                        <div className="co-review-item-price">₹{item.price * (item.qyt || 1)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {localError && <div className="co-error">{localError}</div>}

                <button
                  className="co-continue-btn"
                  onClick={handlePlaceOrderFinal}
                  disabled={loading}
                >
                  {loading
                    ? <span className="co-loading">⏳ Processing payment...</span>
                    : selPay === "cod"
                      ? `✅ Place Order (COD) · ₹${(Math.max(0, total) + 5).toFixed(0)}`
                      : `🔒 Pay Securely · ₹${(Math.max(0, total) + 5).toFixed(0)}`
                  }
                </button>
                <p className="co-place-note">
                  By placing this order you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            )}

          </div>

          {/* ══ RIGHT: ORDER SUMMARY ══ */}
          <div className="co-right">
            <div className="co-summary">
              <div className="co-summary-title">Order Summary</div>

              <div className="co-summary-items">
                {cartItems.map((item, i) => (
                  <div key={i} className="co-summary-item">
                    <div className="co-summary-img-wrap">
                      <img
                        src={item.image || item.images}
                        alt={item.name || item.title}
                        onError={e => { e.target.src = "https://placehold.co/48x48?text=?"; }}
                      />
                      <span className="co-summary-qty-badge">{item.qyt || 1}</span>
                    </div>
                    <div className="co-summary-item-info">
                      <span className="co-summary-item-name">{item.name || item.title}</span>
                      <span className="co-summary-item-unit">₹{item.price} per unit</span>
                    </div>
                    <div className="co-summary-item-price">₹{item.price * (item.qyt || 1)}</div>
                  </div>
                ))}
              </div>

              <div className="co-summary-divider" />

              <div className="co-summary-rows">
                <div className="co-summary-row">
                  <span>Item total</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="co-summary-row">
                  <span>Delivery fee</span>
                  {delivery === 0
                    ? <span className="co-free">FREE <s className="co-crossed">₹49</s></span>
                    : <span>₹{delivery}</span>
                  }
                </div>
                <div className="co-summary-row">
                  <span>Handling charge</span>
                  <span>₹5</span>
                </div>
                {discount > 0 && (
                  <div className="co-summary-row co-discount-row">
                    <span>Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
              </div>

              <div className="co-summary-divider" />

              <div className="co-summary-total">
                <span>To pay</span>
                <span>₹{(Math.max(0, total) + 5).toFixed(0)}</span>
              </div>

              {subtotal >= 499 && (
                <div className="co-savings-pill">
                  🎉 Your savings on this order: ₹{(49 + discount).toFixed(0)}
                </div>
              )}

              <div className="co-summary-divider" />

              <div className="co-trust-row">
                <div className="co-trust-item"><span>🔒</span><p>100% Secure</p></div>
                <div className="co-trust-item"><span>↩️</span><p>Easy Returns</p></div>
                <div className="co-trust-item"><span>⚡</span><p>Fast Delivery</p></div>
              </div>
            </div>

            <div className="co-cancel-policy">
              <div className="co-cancel-header"><span>📋</span> Cancellation Policy</div>
              <p>Orders can be cancelled before dispatch. Once dispatched, you can request a return within 7 days of delivery.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── helper (outside component so it doesn't cause re-init) ── */
function buildDefaultAddresses(user) {
  const navLoc   = localStorage.getItem("userLocation") || "";
  const parsed   = parseNavLocation(navLoc);
  const userName = user?.name  || "Your Name";
  const userPhone = user?.phone || "";
  const addresses = [];

  if (parsed) {
    addresses.push({
      id: 1,
      tag:  "Current Location",
      name: userName,
      flat: parsed.area,
      area: parsed.area,
      city: parsed.city,
      state: parsed.state,
      pin:  "",
      phone: userPhone,
      full: `${parsed.area}, ${parsed.city}${parsed.state ? ", " + parsed.state : ""}`,
      fromNav: true,
    });
  }

  const saved = JSON.parse(localStorage.getItem("myshop_addresses") || "[]");
  saved.forEach((a, i) => addresses.push({ ...a, id: i + 2 }));

  return addresses;
}

export default Checkout;