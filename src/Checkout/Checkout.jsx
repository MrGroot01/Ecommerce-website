// FILE: src/Checkout/Checkout.jsx
// Drop-in replacement for your existing Checkout.jsx
// Keeps all your existing UI — adds real Razorpay payment at the final step.

import React, { useState, useContext } from "react";
import "./Checkout.css";
// import { useRazorpay } from "../hooks/useRazorpay";
import { useRazorpay } from "../hooks/useRazorpay";
import { user_data, cleardata } from "../App";

const SAVED_ADDRESSES = [
  {
    id: 1,
    tag: "Home",
    name: "Rahul Sharma",
    line: "42, 3rd Cross, Indiranagar\nBengaluru, Karnataka - 560038",
    phone: "9876543210",
  },
  {
    id: 2,
    tag: "Work",
    name: "Rahul Sharma",
    line: "Office Block B, Koramangala\nBengaluru, Karnataka - 560095",
    phone: "9876543210",
  },
];

const PAYMENT_METHODS = [
  { id: "razorpay", icon: "💳", name: "Pay Online",          desc: "UPI, Cards, Net Banking via Razorpay" },
  { id: "cod",      icon: "💵", name: "Cash on Delivery",    desc: "Pay when you receive" },
];

const STEPS = ["Address", "Payment", "Review"];

const Checkout = ({ cartItems, subtotal, delivery, discount, total, onBack }) => {
  const user   = useContext(user_data);
  const clear1 = useContext(cleardata);

  const { initiatePayment, loading, error: payError, orderStatus, orderId } = useRazorpay();

  const [step,         setStep]         = useState(0);
  const [selAddr,      setSelAddr]      = useState(1);
  const [showNewAddr,  setShowNewAddr]  = useState(false);
  const [newAddr,      setNewAddr]      = useState({ name:"", phone:"", line1:"", city:"", state:"", pin:"", tag:"Home" });
  const [savedAddrs,   setSavedAddrs]   = useState(SAVED_ADDRESSES);
  const [selPay,       setSelPay]       = useState("razorpay");
  const [localError,   setLocalError]   = useState("");

  // ── Save new address ────────────────────────────────────────────────────
  const handleSaveAddr = () => {
    if (!newAddr.name || !newAddr.line1 || !newAddr.city || !newAddr.pin) return;
    const next = {
      id:    Date.now(),
      tag:   newAddr.tag,
      name:  newAddr.name,
      line:  `${newAddr.line1}\n${newAddr.city}, ${newAddr.state} - ${newAddr.pin}`,
      phone: newAddr.phone,
    };
    setSavedAddrs([...savedAddrs, next]);
    setSelAddr(next.id);
    setShowNewAddr(false);
    setNewAddr({ name:"", phone:"", line1:"", city:"", state:"", pin:"", tag:"Home" });
  };

  // ── Place order handler ─────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setLocalError("");
    const addr = savedAddrs.find(a => a.id === selAddr);
    if (!addr) { setLocalError("Please select a delivery address."); return; }

    if (selPay === "cod") {
      // COD — no payment gateway, just mark placed locally
      // You can add a separate Django endpoint for COD if needed
      alert(`Order placed with Cash on Delivery!\nDelivery to: ${addr.name}`);
      clear1();
      return;
    }

    // Online payment via Razorpay
    await initiatePayment({
      cartItems:       cartItems,
      deliveryAddress: `${addr.name}, ${addr.line.replace("\n", ", ")} | 📞 ${addr.phone}`,
      deliveryCharge:  delivery,
      userName:  user?.name  || addr.name,
      userEmail: user?.email || "",
      userPhone: user?.phone || addr.phone,
      onSuccess: (oid) => {
        clear1();           // empty the cart on success
        console.log("Order success:", oid);
      },
      onFailure: (reason) => {
        setLocalError(typeof reason === "string" ? reason : reason?.description || "Payment failed.");
      },
    });
  };

  // ── Order SUCCESS screen ────────────────────────────────────────────────
  if (orderStatus === "SUCCESS") {
    return (
      <div className="checkout-page">
        <div className="checkout-inner">
          <div className="success-screen">
            <div className="success-icon">✓</div>
            <div className="success-title">Order Placed!</div>
            <div className="success-sub">Thank you! Your payment was successful and the order is confirmed.</div>
            {orderId && (
              <div className="success-order">Order ID: #{String(orderId).slice(-8).toUpperCase()}</div>
            )}
            <button className="success-cta" onClick={onBack}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Order FAILED screen ─────────────────────────────────────────────────
  if (orderStatus === "FAILED") {
    return (
      <div className="checkout-page">
        <div className="checkout-inner">
          <div className="success-screen failed-screen">
            <div className="success-icon failed-icon">✕</div>
            <div className="success-title">Payment Failed</div>
            <div className="success-sub">{payError || "Your payment could not be processed. Please try again."}</div>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:20 }}>
              <button className="success-cta" onClick={() => window.location.reload()}>Try Again</button>
              <button className="success-cta" style={{ background:"#555" }} onClick={onBack}>Back to Cart</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAddr = savedAddrs.find(a => a.id === selAddr);

  return (
    <div className="checkout-page">
      <div className="checkout-inner">

        {/* Top bar */}
        <div className="checkout-topbar">
          <button className="back-btn" onClick={onBack}>← Back to Cart</button>
          <h1 className="checkout-title">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="steps-bar">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div
                className={`step-item ${i === step ? "active" : i < step ? "done" : ""}`}
                onClick={() => i < step && setStep(i)}
              >
                <div className="step-num">{i < step ? "✓" : i + 1}</div>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-layout">

          {/* ── Left panel ── */}
          <div>

            {/* STEP 0 — Address */}
            {step === 0 && (
              <div className="checkout-panel">
                <div className="panel-title">Delivery Address</div>

                <div className="address-list">
                  {savedAddrs.map(addr => (
                    <div
                      key={addr.id}
                      className={`address-card ${selAddr === addr.id ? "selected" : ""}`}
                      onClick={() => setSelAddr(addr.id)}
                    >
                      <div className="addr-radio"><div className="addr-dot" /></div>
                      <div className="addr-tag">{addr.tag}</div>
                      <div className="addr-name">{addr.name}</div>
                      <div className="addr-line" style={{ whiteSpace:"pre-line" }}>{addr.line}</div>
                      <div className="addr-line" style={{ marginTop:4 }}>📞 {addr.phone}</div>
                    </div>
                  ))}
                </div>

                <div className="add-addr-toggle" onClick={() => setShowNewAddr(!showNewAddr)}>
                  + Add a new address
                </div>

                {showNewAddr && (
                  <div className="new-addr-form">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" placeholder="Rahul Sharma"
                        value={newAddr.name} onChange={e => setNewAddr({...newAddr, name:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="10-digit number"
                        value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone:e.target.value})} />
                    </div>
                    <div className="form-group full">
                      <label className="form-label">Address Line</label>
                      <input className="form-input" placeholder="House no., Street, Area"
                        value={newAddr.line1} onChange={e => setNewAddr({...newAddr, line1:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" placeholder="Bengaluru"
                        value={newAddr.city} onChange={e => setNewAddr({...newAddr, city:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input className="form-input" placeholder="Karnataka"
                        value={newAddr.state} onChange={e => setNewAddr({...newAddr, state:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">PIN Code</label>
                      <input className="form-input" placeholder="560001"
                        value={newAddr.pin} onChange={e => setNewAddr({...newAddr, pin:e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select className="form-select" value={newAddr.tag}
                        onChange={e => setNewAddr({...newAddr, tag:e.target.value})}>
                        <option>Home</option><option>Work</option><option>Other</option>
                      </select>
                    </div>
                    <button className="save-addr-btn" onClick={handleSaveAddr}>Save Address</button>
                  </div>
                )}

                <button className="continue-btn" onClick={() => setStep(1)}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 1 — Payment */}
            {step === 1 && (
              <div className="checkout-panel">
                <div className="panel-title">Payment Method</div>

                <div className="payment-methods">
                  {PAYMENT_METHODS.map(pm => (
                    <div
                      key={pm.id}
                      className={`pay-card ${selPay === pm.id ? "selected" : ""}`}
                      onClick={() => setSelPay(pm.id)}
                    >
                      <div className="pay-icon">{pm.icon}</div>
                      <div className="pay-info">
                        <div className="pay-name">{pm.name}</div>
                        <div className="pay-desc">{pm.desc}</div>
                      </div>
                      <div className="pay-radio"><div className="pay-radio-dot" /></div>
                    </div>
                  ))}
                </div>

                {selPay === "razorpay" && (
                  <div className="razorpay-info">
                    🔒 You'll be redirected to the secure Razorpay checkout. Supports UPI, Debit/Credit cards, Net Banking & Wallets.
                  </div>
                )}

                <button className="continue-btn" onClick={() => setStep(2)}>
                  Review Order →
                </button>
              </div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <div className="checkout-panel">
                <div className="panel-title">Review & Place Order</div>

                {/* Address summary */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:"0.72rem", color:"#777", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>Delivering to</div>
                  {currentAddr && (
                    <div style={{ fontSize:"0.85rem", color:"#ccc", lineHeight:1.6 }}>
                      <strong style={{ color:"#f0ede8" }}>{currentAddr.name}</strong>
                      {" — "}{currentAddr.line.replace("\n", ", ")}
                      <span style={{ color:"#e8612a", marginLeft:10, cursor:"pointer", fontSize:"0.75rem" }}
                        onClick={() => setStep(0)}>Change</span>
                    </div>
                  )}
                </div>

                {/* Payment summary */}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:"0.72rem", color:"#777", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:8 }}>Payment via</div>
                  <div style={{ fontSize:"0.85rem", color:"#ccc" }}>
                    {PAYMENT_METHODS.find(p => p.id === selPay)?.name}
                    <span style={{ color:"#e8612a", marginLeft:10, cursor:"pointer", fontSize:"0.75rem" }}
                      onClick={() => setStep(1)}>Change</span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ fontSize:"0.72rem", color:"#777", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>Items ({cartItems.length})</div>
                {cartItems.map((item, i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                    <img src={item.image || item.images} alt={item.title || item.name}
                      style={{ width:40, height:40, borderRadius:7, objectFit:"cover", background:"#222" }}
                      onError={e => { e.target.src = "https://placehold.co/40x40?text=?"; }} />
                    <div style={{ flex:1, fontSize:"0.82rem", color:"#ccc" }}>{item.title || item.name}</div>
                    <div style={{ fontSize:"0.82rem", color:"#f0ede8", fontWeight:600 }}>₹{item.price * (item.qyt || 1)}</div>
                  </div>
                ))}

                {/* Error */}
                {(localError || payError) && (
                  <div className="pay-error">{localError || payError}</div>
                )}

                <button
                  className="continue-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading
                    ? "⏳ Processing..."
                    : selPay === "cod"
                      ? `Place Order (COD) · ₹${Math.max(0, total).toFixed(0)}`
                      : `Pay Now · ₹${Math.max(0, total).toFixed(0)}`
                  }
                </button>
              </div>
            )}

          </div>

          {/* ── Right: Order Summary ── */}
          <div className="order-summary-box">
            <div className="os-title">Order Summary</div>

            {cartItems.map((item, i) => (
              <div className="os-item" key={i}>
                <img src={item.image || item.images} alt={item.title || item.name}
                  className="os-item-img"
                  onError={e => { e.target.src = "https://placehold.co/40x40?text=?"; }} />
                <div className="os-item-info">
                  <div className="os-item-name">{item.title || item.name}</div>
                  <div className="os-item-qty">Qty: {item.qyt || 1}</div>
                </div>
                <div className="os-item-price">₹{item.price * (item.qyt || 1)}</div>
              </div>
            ))}

            <hr className="os-divider" />
            <div className="os-row"><span>Subtotal</span><span>₹{subtotal.toFixed(0)}</span></div>
            <div className="os-row">
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? "#4caf50" : undefined }}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="os-row"><span>Discount</span><span style={{ color:"#4caf50" }}>−₹{discount}</span></div>
            )}
            <hr className="os-divider" />
            <div className="os-total-row">
              <span className="os-total-label">Total</span>
              <span className="os-total-value">₹{Math.max(0, total).toFixed(0)}</span>
            </div>

            <div className="secure-badge">🔒 100% Secure Checkout</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;