import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", category: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .send(
        "service_tebaxvm",
        "template_cuh2u0w",
        { name: form.name, email: form.email, message: `[${form.category}] ${form.subject}\n\n${form.message}` },
        "ryF8HWQaIgJro76An"
      )
      .then(() => {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", category: "", message: "" });
      })
      .catch(() => setStatus("error"));
  };

  const infoCards = [
    {
      icon: "📦",
      title: "Order Support",
      desc: "Track orders, report issues, request cancellations or returns.",
      detail: "orders@quickcart.in",
      sub: "Mon–Sat · 9AM–8PM IST",
      color: "grn",
    },
    {
      icon: "💳",
      title: "Payments & Refunds",
      desc: "Payment failures, refund status, billing queries.",
      detail: "payments@quickcart.in",
      sub: "Mon–Sat · 9AM–6PM IST",
      color: "blu",
    },
    {
      icon: "🎁",
      title: "Rewards & Offers",
      desc: "Points, coupons, cashback and promotional deals.",
      detail: "rewards@quickcart.in",
      sub: "Mon–Fri · 10AM–5PM IST",
      color: "amb",
    },
    {
      icon: "💬",
      title: "General Enquiry",
      desc: "Feedback, partnerships, press or anything else.",
      detail: "hello@quickcart.in",
      sub: "Mon–Fri · 9AM–6PM IST",
      color: "pur",
    },
  ];

  const faqs = [
    { q: "How do I track my order?", a: "Go to My Orders in your account dashboard. Each order has a real-time tracking link." },
    { q: "How long does delivery take?", a: "Standard delivery is 2–5 days. Express delivery is available in select cities within 30 minutes." },
    { q: "What is your return policy?", a: "We offer a hassle-free 7-day return policy on all eligible items. Initiate via My Orders." },
    { q: "How do I apply a coupon?", a: "Enter the coupon code on the checkout page in the 'Apply Coupon' field before payment." },
    { q: "Is my payment information secure?", a: "Yes. All transactions are encrypted end-to-end. We never store your full card details." },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section className="cp-root">

      {/* ── HERO ── */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <span className="cp-hero-pill">🛒 QuickCart Support</span>
          <h1 className="cp-hero-title">
            We'd love to <span className="cp-hero-accent">hear from you</span>
          </h1>
          <p className="cp-hero-sub">
            Our support team is here 7 days a week. Average response time is under 2 hours.
          </p>
          <div className="cp-hero-trust">
            <span>⚡ 2-hr avg response</span>
            <span>📞 Free support calls</span>
            <span>✅ 98% satisfaction rate</span>
          </div>
        </div>
      </div>

      {/* ── CONTACT INFO CARDS ── */}
      <div className="cp-cards-wrap">
        <div className="cp-cards">
          {infoCards.map((c, i) => (
            <div key={i} className={`cp-card cp-card-${c.color}`}>
              <div className="cp-card-icon">{c.icon}</div>
              <div className="cp-card-body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <a href={`mailto:${c.detail}`} className="cp-card-email">{c.detail}</a>
                <span className="cp-card-hours">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN SECTION: FORM + SIDEBAR ── */}
      <div className="cp-main-wrap">
        <div className="cp-main">

          {/* ── FORM ── */}
          <div className="cp-form-card">
            <div className="cp-form-head">
              <h2>Send us a Message</h2>
              <p>Fill in the form and we'll get back to you within 2 hours</p>
            </div>

            {status === "success" && (
              <div className="cp-success-banner">
                <span>✅</span>
                <div>
                  <strong>Message sent!</strong>
                  <p>We've received your message and will reply to {form.email || "your email"} shortly.</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="cp-error-banner">
                <span>❌</span>
                <div>
                  <strong>Something went wrong</strong>
                  <p>Please try again or email us directly at hello@quickcart.in</p>
                </div>
              </div>
            )}

            <form className="cp-form" onSubmit={sendEmail}>
              <div className="cp-form-row">
                <div className="cp-field">
                  <label>Full Name <span>*</span></label>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} placeholder="Ravi Kumar" required
                  />
                </div>
                <div className="cp-field">
                  <label>Email Address <span>*</span></label>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="ravi@email.com" required
                  />
                </div>
              </div>

              <div className="cp-form-row">
                <div className="cp-field">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select a topic</option>
                    <option value="Order Issue">📦 Order Issue</option>
                    <option value="Payment & Refund">💳 Payment & Refund</option>
                    <option value="Delivery">🚚 Delivery Query</option>
                    <option value="Product">🛒 Product Question</option>
                    <option value="Rewards">🎁 Rewards & Offers</option>
                    <option value="Returns">↩️ Returns & Exchange</option>
                    <option value="Account">👤 Account Help</option>
                    <option value="Other">💬 Other</option>
                  </select>
                </div>
                <div className="cp-field">
                  <label>Subject <span>*</span></label>
                  <input
                    type="text" name="subject" value={form.subject}
                    onChange={handleChange} placeholder="Brief subject of your query" required
                  />
                </div>
              </div>

              <div className="cp-field">
                <label>Message <span>*</span></label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Describe your issue or question in detail. Include order ID if relevant."
                  rows={5} required
                />
              </div>

              <button type="submit" className={`cp-submit ${status === "sending" ? "cp-sending" : ""}`} disabled={status === "sending"}>
                {status === "sending" ? (
                  <><span className="cp-spinner" />Sending…</>
                ) : (
                  <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="cp-aside">

            {/* Quick contacts */}
            <div className="cp-aside-card">
              <h3>📞 Quick Contact</h3>
              <div className="cp-quick-list">
                <a href="tel:18001234567" className="cp-quick-item">
                  <span className="cp-qi-icon cp-qi-grn">📞</span>
                  <div>
                    <strong>Call Us Free</strong>
                    <span>+91 7483594153</span>
                    <small>Mon–Sat · 9AM–8PM</small>
                  </div>
                </a>
                <a href="mailto:support@quickcart.in" className="cp-quick-item">
                  <span className="cp-qi-icon cp-qi-blu">✉️</span>
                  <div>
                    <strong>Email Support</strong>
                    <span>kirand09876@gmail.com</span>
                    <small>Reply within 2 hours</small>
                  </div>
                </a>
                <div className="cp-quick-item">
                  <span className="cp-qi-icon cp-qi-amb">💬</span>
                  <div>
                    <strong>Live Chat</strong>
                    <span>Available on app</span>
                    <small>24/7 availability</small>
                  </div>
                </div>
                <div className="cp-quick-item">
                  <span className="cp-qi-icon cp-qi-pur">📍</span>
                  <div>
                    <strong>Head Office</strong>
                    <span>Bengaluru, Karnataka</span>
                    <small>560001, India</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="cp-aside-card">
              <h3>🕐 Support Hours</h3>
              <div className="cp-hours-list">
                {[
                  { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
                  { day: "Saturday",        time: "9:00 AM – 6:00 PM" },
                  { day: "Sunday",          time: "10:00 AM – 4:00 PM" },
                ].map((h, i) => (
                  <div key={i} className="cp-hour-row">
                    <span>{h.day}</span>
                    <span className="cp-hour-time">{h.time}</span>
                  </div>
                ))}
                <div className="cp-hour-note">⚡ Emergency orders: 24/7</div>
              </div>
            </div>

            {/* Social */}
            <div className="cp-aside-card">
              <h3>🌐 Follow Us</h3>
              <div className="cp-social-row">
                {[
                  { icon: "📘", label: "Facebook",  href: "https://facebook.com",  cls: "fb"  },
                  { icon: "📸", label: "Instagram", href: "https://instagram.com", cls: "ig"  },
                  { icon: "🐦", label: "Twitter",   href: "https://twitter.com",   cls: "tw"  },
                  { icon: "▶️", label: "YouTube",   href: "https://youtube.com",   cls: "yt"  },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" className={`cp-social-btn cp-s-${s.cls}`}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="cp-faq-wrap">
        <div className="cp-faq-inner">
          <div className="cp-faq-head">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common queries</p>
          </div>
          <div className="cp-faq-list">
            {faqs.map((f, i) => (
              <div key={i} className={`cp-faq-item ${openFaq === i ? "cp-faq-open" : ""}`}>
                <button className="cp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d={openFaq === i ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                  </svg>
                </button>
                {openFaq === i && <p className="cp-faq-a">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="cp-footer">
        <div className="cp-footer-inner">
          <div className="cp-footer-brand">
            <h3>🛒 QuickCart</h3>
            <p>Your trusted daily needs partner across India.</p>
          </div>
          <div className="cp-footer-links">
            <a href="/Products">Shop</a>
            <a href="/pharmacy">Pharmacy</a>
            <a href="/petcare">Pet Care</a>
            <a href="/babycare">Baby Care</a>
            <a href="/orders">My Orders</a>
            <a href="/profile">Account</a>
          </div>
          <p className="cp-footer-copy">© 2026 QuickCart. All Rights Reserved.</p>
        </div>
      </footer>

    </section>
  );
};

export default Contact;