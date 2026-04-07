import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./About.css";

/* ── Animated counter hook ── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

/* ── Intersection Observer hook ── */
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

/* ── Stat item ── */
const StatItem = ({ value, suffix, label, icon, color, started }) => {
  const num = useCounter(value, 2200, started);
  return (
    <div className={`ab-stat ab-stat-${color}`}>
      <div className="ab-stat-icon">{icon}</div>
      <div className="ab-stat-val">{num.toLocaleString()}{suffix}</div>
      <div className="ab-stat-label">{label}</div>
    </div>
  );
};

const About = () => {
  const [statsRef, statsInView] = useInView();
  const [activeValue, setActiveValue] = useState(0);

  const stats = [
    { value: 1000000, suffix: "+", label: "Happy Customers", icon: "😊", color: "grn" },
    { value: 50000,   suffix: "+", label: "Products Listed",  icon: "📦", color: "blu" },
    { value: 10000,   suffix: "+", label: "Daily Orders",     icon: "🚀", color: "amb" },
    { value: 500,     suffix: "+", label: "Brand Partners",   icon: "🤝", color: "pur" },
    { value: 98,      suffix: "%", label: "Satisfaction Rate",icon: "⭐", color: "grn" },
    { value: 30,      suffix: "m", label: "Avg Delivery",     icon: "⚡", color: "red" },
  ];

  const features = [
    { icon: "⚡", title: "30-Min Delivery",   desc: "Lightning-fast delivery in select cities. Your order reaches you before you even miss it.", color: "grn" },
    { icon: "🛡️", title: "100% Secure",       desc: "End-to-end encrypted payments. We never store your card details — ever.", color: "blu" },
    { icon: "↩️", title: "Easy Returns",      desc: "7-day hassle-free returns on all eligible items. No forms, no questions.", color: "amb" },
    { icon: "💰", title: "Best Price",         desc: "We scan 1000+ sellers to guarantee you the lowest price every single time.", color: "pur" },
    { icon: "🌿", title: "Fresh & Organic",    desc: "Directly sourced from farms and certified suppliers — freshness guaranteed.", color: "teal" },
    { icon: "📞", title: "24/7 Support",       desc: "Our dedicated team is available round the clock via chat, call, or email.", color: "red" },
  ];

  const values = [
    { title: "Customer First",   icon: "👥", desc: "Every decision we make starts and ends with what's best for our customers. Your satisfaction is our north star." },
    { title: "Radical Honesty",  icon: "💎", desc: "We're transparent about prices, sourcing, and delivery. No hidden charges, no fine print surprises." },
    { title: "Speed & Precision",icon: "🚀", desc: "We obsess over efficiency. From order to doorstep, every minute counts and we make it count well." },
    { title: "Sustainability",   icon: "🌿", desc: "We're committed to eco-friendly packaging, carbon-neutral deliveries, and supporting local farmers." },
  ];

const timeline = [
  {
    year: "Jan 2026",
    title: "Project Idea Started",
    desc: "Started planning an eCommerce platform to learn full-stack development using React and Django.",
    color: "grn"
  },
  {
    year: "Feb 2026",
    title: "UI Design & Frontend",
    desc: "Designed responsive UI using React. Built homepage, product pages, and cart interface.",
    color: "blu"
  },
  {
    year: "Mar 2026",
    title: "Backend Development",
    desc: "Developed REST APIs using Django REST Framework. Implemented authentication and product management.",
    color: "amb"
  },
  {
    year: "Mar 2026",
    title: "Payment Integration",
    desc: "Integrated Razorpay payment gateway and implemented secure order processing system.",
    color: "pur"
  },
  {
    year: "Apr 2026",
    title: "Project Deployment",
    desc: "Deployed frontend on Vercel and backend on Render. Successfully running full-stack application.",
    color: "teal"
  },
  {
    year: "Future",
    title: "Upcoming Features",
    desc: "Planning to add wishlist, real-time order tracking, AI recommendations, and mobile app version.",
    color: "red"
  }
];

  const team = [
    { name: "Kiran D T",    role: "Team members",     av: "RK", color: "grn",  bio: "Developed a full-stack eCommerce website using React and Django. Focused on UI design, API integration, and payment gateway implementation." },
    { name: "Shiva Shankar",  role: "Team Members",     av: "PS", color: "blu",  bio: "Worked on backend development using Django REST Framework. Built APIs, handled authentication, and managed database operations." },
    { name: "Teju patil",  role: "Team Members",     av: "PS", color: "grn",  bio: "Developed a full-stack eCommerce website using React and Django. Focused on UI design, API integration, and payment gateway implementation.." },
    { name: "Deepak",  role: "Team Members",     av: "PS", color: "blu",  bio: "Worked on backend development using Django REST Framework. Built APIs, handled authentication, and managed database operations." },

  ];

  const categories = [
    { icon: "🥦", name: "Groceries",     count: "1000+", link: "/Products" },
    { icon: "💊", name: "Pharmacy",      count: "500+",  link: "/pharmacy" },
    { icon: "🐾", name: "Pet Care",      count: "300+",  link: "/petcare"  },
    { icon: "👶", name: "Baby Care",     count: "400+",  link: "/babycare" },
    { icon: "🧴", name: "Personal Care", count: "200+",  link: "/Products" },
    { icon: "📱", name: "Electronics",   count: "150+",  link: "/Products" },
  ];

  return (
    <div className="ab-root">

      {/* ══ HERO ══ */}
      <section className="ab-hero">
        <div className="ab-hero-bg" />
        <div className="ab-hero-inner">
          <span className="ab-eyebrow">🛒 About QuickCart</span>
          <h1 className="ab-hero-title">
            India's Most Trusted<br />
            <span className="ab-hero-accent">Daily Needs Platform</span>
          </h1>
          <p className="ab-hero-sub">
            From fresh groceries to medicines to pet food — we deliver everything you need,
            right to your doorstep in 30 minutes. Founded in 2020, trusted by 1M+ customers.
          </p>
          <div className="ab-hero-actions">
            <Link to="/Products" className="ab-hero-cta-primary">Shop Now →</Link>
            <Link to="/contact"  className="ab-hero-cta-ghost">Contact Us</Link>
          </div>
          <div className="ab-hero-pills">
            <span>🚚 30-Min Delivery</span>
            <span>🔒 Secure Checkout</span>
            <span>↩️ Easy Returns</span>
            <span>⭐ 4.9★ Rated App</span>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="ab-stats-section" ref={statsRef}>
        <div className="ab-stats-inner">
          <div className="ab-stats-head">
            <h2>Numbers that speak</h2>
            <p>Growing every day, trusted by millions</p>
          </div>
          <div className="ab-stats-grid">
            {stats.map((s, i) => (
              <StatItem key={i} {...s} started={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ MISSION & VISION ══ */}
      <section className="ab-mv-section">
        <div className="ab-mv-inner">
          <div className="ab-mv-card ab-mv-mission">
            <div className="ab-mv-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To make everyday shopping radically simple, affordable, and accessible for every Indian household.
              We believe that premium quality products shouldn't come with premium wait times or premium price tags.
            </p>
            <ul className="ab-mv-points">
              <li>✅ Deliver in 30 minutes or less</li>
              <li>✅ Beat any competitor's price</li>
              <li>✅ Zero compromise on freshness</li>
            </ul>
          </div>
          <div className="ab-mv-card ab-mv-vision">
            <div className="ab-mv-icon">🌏</div>
            <h2>Our Vision</h2>
            <p>
              To be the operating system of the Indian household — the single platform families trust
              for every daily need, powered by technology, driven by empathy, and built on trust.
            </p>
            <ul className="ab-mv-points">
              <li>🚀 Present in 100 cities by 2027</li>
              <li>🌿 Carbon-neutral by 2026</li>
              <li>🤝 Empowering 10,000 local vendors</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="ab-features-section">
        <div className="ab-features-inner">
          <div className="ab-section-head">
            <h2>Why 1 Million Customers Choose Us</h2>
            <p>We've built every feature with a single goal — making your life easier</p>
          </div>
          <div className="ab-features-grid">
            {features.map((f, i) => (
              <div key={i} className={`ab-feat ab-feat-${f.color}`}>
                <div className="ab-feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="ab-cats-section">
        <div className="ab-cats-inner">
          <div className="ab-section-head">
            <h2>Everything You Need, One Platform</h2>
            <p>6 categories, 2000+ products, same-day delivery</p>
          </div>
          <div className="ab-cats-grid">
            {categories.map((c, i) => (
              <Link key={i} to={c.link} className="ab-cat-tile">
                <span className="ab-cat-icon">{c.icon}</span>
                <strong>{c.name}</strong>
                <span>{c.count} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section className="ab-values-section">
        <div className="ab-values-inner">
          <div className="ab-section-head light">
            <h2>Our Core Values</h2>
            <p>The principles that guide every decision we make</p>
          </div>
          <div className="ab-values-grid">
            {values.map((v, i) => (
              <div
                key={i}
                className={`ab-val ${activeValue === i ? "ab-val-active" : ""}`}
                onMouseEnter={() => setActiveValue(i)}
              >
                <div className="ab-val-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <section className="ab-timeline-section">
        <div className="ab-timeline-inner">
          <div className="ab-section-head">
            <h2>Our Journey</h2>
            <p>From a garage startup to India's fastest-growing quick-commerce platform</p>
          </div>
          <div className="ab-timeline">
            {timeline.map((t, i) => (
              <div key={i} className={`ab-tl-item ${i % 2 === 0 ? "ab-tl-left" : "ab-tl-right"}`}>
                <div className={`ab-tl-card ab-tl-${t.color}`}>
                  <span className="ab-tl-year">{t.year}</span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
                <div className={`ab-tl-dot ab-dot-${t.color}`} />
              </div>
            ))}
            <div className="ab-tl-line" />
          </div>
        </div>
      </section>

      {/* ══ TEAM ══ */}
      <section className="ab-team-section">
        <div className="ab-team-inner">
          <div className="ab-section-head">
            <h2>Meet the Team</h2>
            <p>The people building the future of Indian commerce</p>
          </div>
          <div className="ab-team-grid">
            {team.map((m, i) => (
              <div key={i} className="ab-team-card">
                <div className={`ab-team-av av-${m.color}`}>{m.av}</div>
                <h3>{m.name}</h3>
                <span className="ab-team-role">{m.role}</span>
                <p className="ab-team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APP PROMO ══ */}
      <section className="ab-app-section">
        <div className="ab-app-inner">
          <div className="ab-app-text">
            <span className="ab-app-eyebrow">Now on mobile</span>
            <h2>Shop Smarter on the QuickCart App</h2>
            <p>Exclusive app-only deals, real-time order tracking, and one-tap reorders. Rated 4.9★ by 200K+ users.</p>
            <div className="ab-app-btns">
              <button className="ab-app-btn"><span>📱</span> App Store</button>
              <button className="ab-app-btn"><span>🤖</span> Play Store</button>
            </div>
          </div>
          <div className="ab-app-visual">
            <div className="ab-phone-mockup">
              <div className="ab-phone-screen">📲</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA STRIP ══ */}
      <section className="ab-cta-section">
        <div className="ab-cta-inner">
          <h2>Ready to experience QuickCart?</h2>
          <p>Join 1 million+ happy customers. Get your first order delivered in 30 minutes.</p>
          <div className="ab-cta-btns">
            <Link to="/Products" className="ab-cta-primary">Start Shopping →</Link>
            <Link to="/contact"  className="ab-cta-ghost">Talk to Us</Link>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="ab-footer">
        <div className="ab-footer-inner">
          <div className="ab-footer-brand">
            <h3>🛒 QuickCart</h3>
            <p>Your trusted daily needs partner across India.</p>
          </div>
          <div className="ab-footer-links">
            <Link to="/Products">Shop</Link>
            <Link to="/pharmacy">Pharmacy</Link>
            <Link to="/petcare">Pet Care</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <p className="ab-footer-copy">© 2026 QuickCart. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default About;