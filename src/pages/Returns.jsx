// FILE: src/pages/Returns.jsx
// Route: /returns

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '/Pages.css'

const POLICY_ITEMS = [
  { icon:"📅", title:"7-Day Return Window",  desc:"You have 7 days from delivery to initiate a return. Item must be unused, in original packaging with all tags intact." },
  { icon:"🔍", title:"Eligible Products",    desc:"Most Pharmacy, Pet Care, Baby Care and Grocery products are eligible unless marked non-returnable on the product page." },
  { icon:"🚫", title:"Non-Returnable Items", desc:"Opened medicines, consumable pet food (once opened), perishable groceries, personal hygiene products, and digital items." },
  { icon:"📦", title:"Original Packaging",   desc:"All returned items must be in original sealed packaging. Missing accessories or misuse-damage will result in rejection." },
  { icon:"💰", title:"Refund Timeline",       desc:"Refunds are processed within 3–7 business days to your original payment method after inspection." },
  { icon:"🚚", title:"Free Return Pickup",    desc:"We offer free pickup for eligible returns in serviceable areas. Ship at your own cost if your area is not covered." },
];

const STEPS = [
  { step:"1", icon:"📱", title:"Initiate Return",  desc:"Go to Orders → Select the order → Click 'Return or Refund'. Choose items and reason." },
  { step:"2", icon:"📦", title:"Pack Your Item",    desc:"Pack securely in original packaging with all accessories, manuals and tags." },
  { step:"3", icon:"🚚", title:"Schedule Pickup",   desc:"Choose a convenient date for our delivery partner to pick up from your address." },
  { step:"4", icon:"🔍", title:"Quality Check",     desc:"Our team inspects the item within 24–48 hours of receipt." },
  { step:"5", icon:"💳", title:"Refund Processed",  desc:"Approved refunds are credited within 3–7 business days." },
];

const FAQ_ITEMS = [
  { q:"Can I return an opened medicine?",                        a:"No. Opened medicines are non-returnable for safety and hygiene. Only sealed, unexpired medicines in original packaging qualify." },
  { q:"What if I received a damaged or wrong product?",          a:"Raise a return request within 48 hours of delivery with photos. We will arrange immediate replacement or full refund." },
  { q:"How long does the refund take?",                          a:"UPI: 3–5 days. Credit/Debit card: 5–7 days depending on your bank. Net Banking: 3–5 days." },
  { q:"Can I return pet food if my pet doesn't like it?",        a:"Unopened pet food in original packaging can be returned within 7 days. Once opened, it is non-returnable." },
  { q:"Will I get a full refund?",                               a:"Yes — full product price is refunded. Delivery charges are refunded only if the return is due to our error." },
  { q:"My return pickup didn't happen — what do I do?",          a:"It will be automatically rescheduled. You can also contact our support team for immediate assistance." },
];

const REASONS = ["Damaged / Defective product","Wrong item delivered","Product not as described","Changed my mind","Quality not as expected","Expired product received","Other"];

const Returns = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Policy");
  const [openFaq,   setOpenFaq]   = useState(null);
  const [formData,  setFormData]  = useState({ orderId:"", itemName:"", reason:"", description:"" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.reason) return;
    setSubmitted(true);
  };

  return (
    <div className="page-root">
      <div className="page-hero returns-hero">
        <div className="page-hero-inner">
          <button className="back-link" onClick={() => navigate(-1)}>← Back</button>
          <div className="page-hero-text">
            <h1>↩️ Returns & Refunds</h1>
            <p>Hassle-free 7-day return policy on eligible products</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* TRUST BADGES */}
        <div className="ret-trust-row">
          {[{icon:"📅",label:"7-Day Returns"},{icon:"🚚",label:"Free Pickup"},{icon:"💰",label:"Full Refund"},{icon:"⚡",label:"Fast Process"}]
            .map((b,i) => (
            <div key={i} className="ret-trust-badge"><span>{b.icon}</span><p>{b.label}</p></div>
          ))}
        </div>

        {/* TABS */}
        <div className="rw-tabs">
          {["Policy","How It Works","Raise a Request","FAQ"].map(t => (
            <button key={t} className={`rw-tab ${activeTab === t ? "rw-tab-active" : ""}`}
              onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        {activeTab === "Policy" && (
          <div className="ret-policy-grid">
            {POLICY_ITEMS.map((p,i) => (
              <div key={i} className="ret-policy-card">
                <div className="ret-policy-icon">{p.icon}</div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "How It Works" && (
          <div className="ret-steps">
            {STEPS.map((s,i) => (
              <div key={i} className="ret-step">
                <div className="ret-step-num">{s.step}</div>
                <div className="ret-step-icon">{s.icon}</div>
                <div className="ret-step-body"><h4>{s.title}</h4><p>{s.desc}</p></div>
                {i < STEPS.length-1 && <div className="ret-step-line" />}
              </div>
            ))}
          </div>
        )}

        {activeTab === "Raise a Request" && (
          <div className="ret-form-wrap">
            {submitted ? (
              <div className="ret-success">
                <div className="ret-success-icon">✅</div>
                <h3>Return Request Submitted!</h3>
                <p>We'll confirm via email and initiate pickup within 24–48 hours.</p>
                <div className="ret-req-id">Request ID: #RET{Date.now().toString().slice(-8)}</div>
                <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:20}}>
                  <button className="oh-action-btn primary" onClick={() => setSubmitted(false)}>Raise Another</button>
                  <Link to="/orders" className="oh-action-btn">View Orders</Link>
                </div>
              </div>
            ) : (
              <form className="ret-form" onSubmit={handleSubmit}>
                <div className="ret-form-grid">
                  <div className="rf-group">
                    <label>Order ID *</label>
                    <input placeholder="e.g. ORD8F2A1C3D" value={formData.orderId}
                      onChange={e => setFormData({...formData,orderId:e.target.value})} required />
                  </div>
                  <div className="rf-group">
                    <label>Product Name</label>
                    <input placeholder="Which item to return?" value={formData.itemName}
                      onChange={e => setFormData({...formData,itemName:e.target.value})} />
                  </div>
                  <div className="rf-group rf-full">
                    <label>Reason *</label>
                    <select value={formData.reason} onChange={e => setFormData({...formData,reason:e.target.value})} required>
                      <option value="">-- Select a reason --</option>
                      {REASONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="rf-group rf-full">
                    <label>Additional Details</label>
                    <textarea rows={4} placeholder="Describe the issue (optional)..."
                      value={formData.description} onChange={e => setFormData({...formData,description:e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="ret-submit-btn">Submit Return Request →</button>
                <p className="ret-form-note">📌 You'll receive a confirmation email with pickup details within 24 hours.</p>
              </form>
            )}
          </div>
        )}

        {activeTab === "FAQ" && (
          <div className="faq-list">
            {FAQ_ITEMS.map((f,i) => (
              <div key={i} className={`faq-item ${openFaq===i?"faq-open":""}`}>
                <button className="faq-q" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  <span>{f.q}</span>
                  <span className="faq-icon">{openFaq===i?"▲":"▼"}</span>
                </button>
                {openFaq===i && <div className="faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        )}

        {/* CONTACT */}
        <div className="ret-contact">
          <h3>Still need help?</h3>
          <p>Our support team is available Mon–Sat, 9AM to 8PM</p>
          <div className="ret-contact-btns">
            <Link to="/help" className="ret-contact-btn primary">💬 Chat with Us</Link>
            <a href="tel:18001234567" className="ret-contact-btn">📞 Call 1800-123-4567</a>
            <a href="mailto:support@myshop.com" className="ret-contact-btn">📧 Email Us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;