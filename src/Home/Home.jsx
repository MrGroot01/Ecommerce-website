import { Link } from "react-router-dom";
import "./Home.css";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { searchvalue, cart_data } from "../App";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ── API endpoints ── */
const API_MAP = {
  baby:       { url: "https://babycare-tawz.onrender.com/api/",            color: "#3B82F6", label: "Baby"     },
  pharmacy:   { url: "https://pharmacyapi-1.onrender.com/api/",            color: "#10B981", label: "Pharmacy" },
  pet:        { url: "https://petcare-byc5.onrender.com/api/",             color: "#F59E0B", label: "Pet"      },
  masala:     { url: "https://masalaitems.onrender.com/api/products/",     color: "#EF4444", label: "Grocery"  },
  electronics:{ url: "https://electronicsitems.onrender.com/api/",         color: "#8B5CF6", label: "Electronics"},
  fashion:    { url: "https://myproject-1-6l2h.onrender.com/api/products/",color: "#EC4899", label: "Fashion"  },
  shoes:      { url: "https://shoes-api-oc8p.onrender.com/shoes/",         color: "#06B6D4", label: "Shoes"    },
  ecommerce:  { url: "https://ecommerceapidata.onrender.com/api/",         color: "#6366F1", label: "General"  },
  upcoming:   { url: "https://productsapi-ov63.onrender.com/api/",         color: "#F97316", label: "New"      },
};

const normalise = (item, category) => ({
  id:       String(item.id || item._id || item.name || Math.random()),
  name:     item.name  || item.title  || item.product_name || "Product",
  price:    Number(item.price || item.cost || item.mrp || 0),
  image:    item.image || item.images?.[0] || item.img || item.photo || "",
  category,
});

/* ── Countdown Timer ── */
const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  return (
    <div className="timer">
      <div className="timer-block"><span>{pad(time.h)}</span><small>HRS</small></div>
      <span className="timer-sep">:</span>
      <div className="timer-block"><span>{pad(time.m)}</span><small>MIN</small></div>
      <span className="timer-sep">:</span>
      <div className="timer-block"><span>{pad(time.s)}</span><small>SEC</small></div>
    </div>
  );
};

/* ── Stars ── */
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="stars-row">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`s ${i < full ? "on" : i === full && half ? "half" : "off"}`} viewBox="0 0 20 20">
          <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
        </svg>
      ))}
      <span className="rating-val">{rating.toFixed(1)}</span>
    </div>
  );
};

/* ── Product Card ── */
const PCard = ({ item, index, onCart, showComing = false, compact = false }) => {
  const [wished, setWished] = useState(false);
  const [added,  setAdded]  = useState(false);
  const price      = item.price > 0 ? item.price : 99;
  const fakeOld    = Math.round(price * (1.15 + (index % 30) / 100));
  const discount   = Math.round(((fakeOld - price) / fakeOld) * 100);
  const fakeRating = parseFloat((3.8 + ((index * 17) % 12) / 10).toFixed(1));
  const fakeRev    = 80 + (index * 93) % 5000;
  const catInfo    = API_MAP[item.category] || { color: "#10B981", label: item.category };

  const handleAdd = () => {
    onCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={`pc-wrap ${compact ? "pc-wrap--compact" : ""}`}>
      <div className={`pc ${showComing ? "pc-coming" : ""}`}>
        <div className="pc-img">
          <img
            src={item.image} alt={item.name}
            onError={e => { e.target.src = "https://placehold.co/300x300/f8fafc/94a3b8?text=No+Image"; }}
          />
          {showComing && <div className="coming-overlay"><span>Coming Soon</span></div>}
          {!showComing && (
            <button className={`wl-btn ${wished ? "wl-active" : ""}`} onClick={() => setWished(w => !w)}>
              <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          )}
          <span className="pc-badge">-{discount}%</span>
          <div className="pc-cat-dot" style={{ background: catInfo.color }}>{catInfo.label}</div>
        </div>
        <div className="pc-body">
          <h4 className="pc-name" title={item.name}>
            {item.name.length > 26 ? item.name.slice(0, 26) + "…" : item.name}
          </h4>
          <Stars rating={fakeRating} />
          <span className="pc-reviews">({fakeRev.toLocaleString()} reviews)</span>
          <div className="pc-price-row">
            <span className="pc-price">₹{price}</span>
            <span className="pc-old">₹{fakeOld}</span>
            <span className="pc-save">-{discount}%</span>
          </div>
          {showComing ? (
            <button className="pc-notify">🔔 Notify Me</button>
          ) : (
            <button className={`pc-add ${added ? "pc-added" : ""}`} onClick={handleAdd}>
              {added ? "✓ Added!" : "+ Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Skeleton ── */
const Skelly = ({ count = 4 }) => (
  <div className="skelly-row">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="skelly-card">
        <div className="skelly-img" />
        <div className="skelly-body">
          <div className="skelly-line" style={{ width: "40%" }} />
          <div className="skelly-line" />
          <div className="skelly-line" style={{ width: "70%" }} />
          <div className="skelly-line btn" />
        </div>
      </div>
    ))}
  </div>
);

/* ── Category Icon Map ── */
const CAT_ICONS = {
  pharmacy: "💊", pet: "🐾", baby: "👶", masala: "🌶️",
  electronics: "📱", fashion: "👗", shoes: "👟", ecommerce: "🛒",
};

/* ════════════ MAIN HOME ════════════ */
const Home = () => {
  const search  = useContext(searchvalue);
  const addCart = useContext(cart_data);

  const [cartNotif, setCartNotif] = useState(null);
  const [products,  setProducts]  = useState({});
  const [upcoming,  setUpcoming]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetches = Object.entries(API_MAP).map(([key, { url }]) =>
      fetch(url)
        .then(r => r.json())
        .then(data => {
          const arr = Array.isArray(data) ? data : data.products || data.data || [];
          return { key, data: arr.map(i => normalise(i, key)) };
        })
        .catch(() => ({ key, data: [] }))
    );
    Promise.all(fetches).then(results => {
      const map = {};
      results.forEach(({ key, data }) => {
        if (key === "upcoming") setUpcoming(data);
        else map[key] = data;
      });
      setProducts(map);
      setLoading(false);
    });
  }, []);

  const handleAddCart = useCallback((item) => {
    addCart(item);
    setCartNotif(item.name);
    setTimeout(() => setCartNotif(null), 2500);
  }, [addCart]);

  /* Slider configs */
  const heroSettings = {
    dots: true, infinite: true, speed: 900, autoplay: true,
    autoplaySpeed: 5000, arrows: false, fade: true, pauseOnHover: false,
  };
  const carouselSettings = (show = 5) => ({
    dots: false, infinite: true, speed: 400, autoplay: true, autoplaySpeed: 3200,
    slidesToShow: show, slidesToScroll: 1, arrows: true,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: Math.min(show, 4) } },
      { breakpoint: 1100, settings: { slidesToShow: Math.min(show, 3) } },
      { breakpoint: 768,  settings: { slidesToShow: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1 } },
    ],
  });
  const brandSettings = {
    dots: false, infinite: true, speed: 4000, autoplay: true, autoplaySpeed: 0,
    cssEase: "linear", slidesToShow: 8, slidesToScroll: 1, arrows: false,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 4 } }],
  };

  /* Static data */
  const heroSlides = [
    {
      bg: "linear-gradient(135deg,#0B1E13,#0D3320,#145C34)",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80",
      tag: "🚚 Daily Essentials",
      title: ["Fresh Groceries", "In 30 Minutes"],
      sub: "Farm-fresh produce & pantry staples delivered blazing fast",
      cta: "Shop Now", link: "/Products", badge: "FREE delivery above ₹499",
    },
    {
      bg: "linear-gradient(135deg,#0F0A2A,#1E0D50,#32168A)",
      img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1400&q=80",
      tag: "🐾 Pet Paradise",
      title: ["Premium Care", "for Your Pets"],
      sub: "Trusted brands, vet-approved nutrition & endless accessories",
      cta: "Explore Pets", link: "/petcare", badge: "Up to 40% OFF",
    },
    {
      bg: "linear-gradient(135deg,#1A0A00,#3D1500,#7A2E00)",
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
      tag: "⚡ Electronics",
      title: ["Latest Gadgets", "Best Prices"],
      sub: "Smartphones, laptops & accessories — all under one roof",
      cta: "Shop Electronics", link: "/Products", badge: "EMI from ₹499/mo",
    },
    {
      bg: "linear-gradient(135deg,#0A1830,#0E2A55,#1A4080)",
      img: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1400&q=80",
      tag: "👶 Baby Care",
      title: ["Safe & Gentle", "Baby Essentials"],
      sub: "Pediatrician-approved products for your little one",
      cta: "Shop Baby", link: "/babycare", badge: "Free pack on ₹999+",
    },
  ];

  const categories = [
    { name: "Grocery & Masala", icon: "🌶️", color: "#EF4444", bg: "#FEF2F2", link: "/Products",  count: "1200+" },
    { name: "Pharmacy",          icon: "💊", color: "#10B981", bg: "#ECFDF5", link: "/pharmacy",  count: "500+"  },
    { name: "Electronics",       icon: "📱", color: "#8B5CF6", bg: "#F5F3FF", link: "/Products",  count: "300+"  },
    { name: "Fashion",           icon: "👗", color: "#EC4899", bg: "#FDF2F8", link: "/Products",  count: "800+"  },
    { name: "Pet Care",          icon: "🐾", color: "#F59E0B", bg: "#FFFBEB", link: "/petcare",   count: "400+"  },
    { name: "Baby Care",         icon: "👶", color: "#3B82F6", bg: "#EFF6FF", link: "/babycare",  count: "350+"  },
    { name: "Footwear",          icon: "👟", color: "#06B6D4", bg: "#ECFEFF", link: "/Products",  count: "600+"  },
    { name: "Personal Care",     icon: "🧴", color: "#6366F1", bg: "#EEF2FF", link: "/Products",  count: "250+"  },
  ];

  const dealTabs = [
    { key: "all",         label: "All Deals"    },
    { key: "pharmacy",    label: "💊 Pharmacy"   },
    { key: "pet",         label: "🐾 Pet"        },
    { key: "baby",        label: "👶 Baby"       },
    { key: "electronics", label: "📱 Electronics"},
    { key: "shoes",       label: "👟 Shoes"      },
    { key: "masala",      label: "🌶️ Grocery"   },
  ];

  const allDeals = Object.values(products).flat();
  const tabDeals = activeTab === "all" ? allDeals : (products[activeTab] || []);

  const promoAds = [
    { icon: "🔥", tag: "Flash Sale", title: "Up to 70% OFF", sub: "On electronics & gadgets", link: "/Products",  bg: "#1E0050", accent: "#8B5CF6" },
    { icon: "🌿", tag: "Organic",    title: "Farm Fresh",    sub: "Vegetables & fruits daily",  link: "/Products",  bg: "#052E16", accent: "#10B981" },
    { icon: "👶", tag: "Baby Week",  title: "Free Shipping", sub: "On all baby products",       link: "/babycare",  bg: "#1E3A5F", accent: "#3B82F6" },
    { icon: "🐾", tag: "Pet Deals",  title: "Buy 2 Get 1",   sub: "On all pet food brands",     link: "/petcare",   bg: "#451A03", accent: "#F59E0B" },
  ];

  const brands = ["Himalaya","Pedigree","Pampers","Nestlé","Johnson's","Dabur","Dove","Colgate","Similac","Whiskas","Cipla","Huggies","Samsung","Nike","Adidas","Parle"];

  const testimonials = [
    { name:"Priya S.", city:"Bengaluru", text:"Super fast delivery! Got my medicines within 30 mins. App is incredibly smooth.", rating:5, av:"P", clr:"#10B981" },
    { name:"Rahul M.", city:"Mumbai",    text:"Best prices for pet food. My dog loves the Pedigree pack. Will definitely reorder!", rating:5, av:"R", clr:"#F59E0B" },
    { name:"Anita K.", city:"Delhi",     text:"Baby diapers always in stock. Trusted quality and same-day delivery — love it!", rating:4, av:"A", clr:"#3B82F6" },
    { name:"Suresh T.", city:"Chennai",  text:"The pharmacy section saved me a trip to the store. Same-day delivery perfection.", rating:5, av:"S", clr:"#8B5CF6" },
    { name:"Meena R.", city:"Hyderabad", text:"Great selection of masalas and groceries. Freshness guaranteed every order.", rating:5, av:"M", clr:"#EC4899" },
  ];

  const whyUs = [
    { icon:"⚡", title:"30-Min Delivery",   desc:"Blazing-fast delivery in select areas. Freshness on every drop.",   color:"#10B981" },
    { icon:"🛡️", title:"100% Secure",       desc:"End-to-end encrypted payments. Your data is always safe.",          color:"#3B82F6" },
    { icon:"↩️", title:"Easy Returns",      desc:"7-day hassle-free returns. No questions, no complicated forms.",    color:"#F59E0B" },
    { icon:"💰", title:"Best Price",        desc:"We compare 1000+ sellers to bring you the lowest price ever.",      color:"#8B5CF6" },
    { icon:"🌿", title:"Certified Fresh",   desc:"Every grocery item is quality-checked before dispatch.",            color:"#EF4444" },
    { icon:"🎁", title:"Loyalty Rewards",   desc:"Earn coins on every order. Redeem for cashback & free delivery.",   color:"#EC4899" },
  ];

  return (
    <section className="home">
      {/* CART TOAST */}
      {cartNotif && (
        <div className="cart-toast">
          <span>✅</span>
          <span><strong>{cartNotif.length > 22 ? cartNotif.slice(0, 22) + "…" : cartNotif}</strong> added to cart!</span>
        </div>
      )}

      {!search && (
        <>
          {/* ── TICKER ── */}
          <div className="ticker-bar">
            <div className="ticker-inner">
              {["🚚 Free delivery on orders ₹499+", "⚡ 30-min delivery in select cities", "🔒 100% Secure Payments", "↩️ 7-day easy returns", "🎁 Use FIRST20 for 20% off your first order", "💊 Flat 30% OFF on medicines"].map((t, i) => (
                <span key={i} className="tick-item">{t}</span>
              ))}
            </div>
          </div>

          {/* ── HERO ── */}
          <div className="hero-wrap">
            <Slider {...heroSettings} className="hero-slider">
              {heroSlides.map((s, i) => (
                <div key={i}>
                  <div className="hero-slide" style={{ background: s.bg }}>
                    <div className="hero-bg-img" style={{ backgroundImage: `url(${s.img})` }} />
                    <div className="hero-vignette" />
                    <div className="hero-content">
                      <span className="hero-tag">{s.tag}</span>
                      <h1 className="hero-title">
                        {s.title.map((t, j) => <span key={j}>{t}<br /></span>)}
                      </h1>
                      <p className="hero-sub">{s.sub}</p>
                      <div className="hero-actions">
                        <Link to={s.link} className="hero-cta">{s.cta} →</Link>
                        <span className="hero-badge">{s.badge}</span>
                      </div>
                    </div>
                    <div className="hero-num">{String(i + 1).padStart(2, "0")}</div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* ── PROMO ADS STRIP ── */}
          <div className="promo-strip">
            {promoAds.map((ad, i) => (
              <Link key={i} to={ad.link} className="promo-ad-card" style={{ "--acc": ad.accent, background: ad.bg }}>
                <div className="pad-icon">{ad.icon}</div>
                <div>
                  <span className="pad-tag" style={{ color: ad.accent }}>{ad.tag}</span>
                  <h4 className="pad-title">{ad.title}</h4>
                  <p className="pad-sub">{ad.sub}</p>
                </div>
                <span className="pad-arrow" style={{ color: ad.accent }}>›</span>
              </Link>
            ))}
          </div>

          {/* ── CATEGORIES ── */}
          <div className="section-wrap">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Browse</span>
                <h2 className="sec-title">Shop by Category</h2>
              </div>
              <Link to="/Products" className="see-all-btn">See All →</Link>
            </div>
            <div className="cat-grid">
              {categories.map((c, i) => (
                <Link key={i} to={c.link} className="cat-card" style={{ "--cat-color": c.color, "--cat-bg": c.bg }}>
                  <div className="cat-icon-wrap">
                    <span className="cat-icon">{c.icon}</span>
                  </div>
                  <div className="cat-info">
                    <h4>{c.name}</h4>
                    <span>{c.count} products</span>
                  </div>
                  <span className="cat-arrow">›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── TODAY'S DEALS with TABS ── */}
          <div className="section-wrap deals-section">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Limited Time</span>
                <h2 className="sec-title">🔥 Today's Deals</h2>
              </div>
              <div className="timer-wrap">
                <span className="timer-label">Ends in</span>
                <CountdownTimer />
              </div>
              <Link to="/Products" className="see-all-btn">View All →</Link>
            </div>
            <div className="deal-tabs">
              {dealTabs.map(t => (
                <button
                  key={t.key}
                  className={`deal-tab ${activeTab === t.key ? "active" : ""}`}
                  onClick={() => setActiveTab(t.key)}
                >{t.label}</button>
              ))}
            </div>
            {loading ? <Skelly /> : (
              <Slider {...carouselSettings(5)} className="prod-slider">
                {tabDeals.slice(0, 20).map((item, i) => (
                  <PCard key={item.id + i} item={item} index={i} onCart={handleAddCart} />
                ))}
              </Slider>
            )}
          </div>

          {/* ── BIG BANNER ── */}
          <div className="big-banner">
            <div className="big-banner-card">
              <div className="bb-left">
                <span className="bb-eyebrow">First Order Special</span>
                <h2>Get Flat <em>20% OFF</em><br />on Your First Order</h2>
                <p>Use code <strong>FIRST20</strong> at checkout. Valid on orders ₹299+</p>
                <Link to="/Products" className="bb-cta">Claim Offer →</Link>
              </div>
              <div className="bb-right">
                <div className="bb-circles">
                  <div className="bb-c bb-c1" />
                  <div className="bb-c bb-c2" />
                  <div className="bb-c bb-c3" />
                  <span className="bb-emoji">🎁</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── PHARMACY ── */}
          <div className="section-wrap">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Health</span>
                <h2 className="sec-title">💊 Pharmacy Picks</h2>
              </div>
              <Link to="/pharmacy" className="see-all-btn">View All →</Link>
            </div>
            <div className="strip-layout">
              <Link to="/pharmacy" className="strip-promo" style={{ "--sp-from": "#052E16", "--sp-to": "#065F46", "--sp-acc": "#34D399" }}>
                <span className="sp-tag">Health & Wellness</span>
                <h3>Medicines &<br />Healthcare</h3>
                <p>Flat 30% OFF on select items</p>
                <span className="sp-cta">Shop Pharmacy →</span>
                <div className="sp-bg-icon">💊</div>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : (products.pharmacy || []).slice(0, 4).map((item, i) => (
                  <PCard key={item.id} item={item} index={i} onCart={handleAddCart} compact />
                ))}
              </div>
            </div>
          </div>

          {/* ── GROCERY / MASALA ── */}
          <div className="section-wrap">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Fresh Daily</span>
                <h2 className="sec-title">🌶️ Grocery & Masala</h2>
              </div>
              <Link to="/Products" className="see-all-btn">View All →</Link>
            </div>
            <div className="strip-layout">
              <Link to="/Products" className="strip-promo" style={{ "--sp-from": "#450A0A", "--sp-to": "#7F1D1D", "--sp-acc": "#FCA5A5" }}>
                <span className="sp-tag">Farm Fresh</span>
                <h3>Spices &<br />Vegetables</h3>
                <p>Directly sourced from farmers</p>
                <span className="sp-cta">Shop Grocery →</span>
                <div className="sp-bg-icon">🌶️</div>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : (products.masala || []).slice(0, 4).map((item, i) => (
                  <PCard key={item.id} item={item} index={i + 5} onCart={handleAddCart} compact />
                ))}
              </div>
            </div>
          </div>

          {/* ── ELECTRONICS ── */}
          <div className="section-wrap">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Tech</span>
                <h2 className="sec-title">📱 Electronics & Gadgets</h2>
              </div>
              <Link to="/Products" className="see-all-btn">View All →</Link>
            </div>
            {loading ? <Skelly /> : (
              <Slider {...carouselSettings(5)} className="prod-slider">
                {(products.electronics || []).slice(0, 15).map((item, i) => (
                  <PCard key={item.id} item={item} index={i + 40} onCart={handleAddCart} />
                ))}
              </Slider>
            )}
          </div>

          {/* ── 3-COL AD BANNERS ── */}
          <div className="section-wrap">
            <div className="ad-banners-grid">
              <Link to="/petcare" className="ad-banner" style={{ background: "linear-gradient(135deg,#451A03,#92400E)" }}>
                <span className="ab-tag">🐾 Pet Special</span>
                <h3>Buy 2 Get 1 Free</h3>
                <p>On all pet food brands</p>
                <span className="ab-cta">Shop Now →</span>
              </Link>
              <Link to="/Products" className="ad-banner" style={{ background: "linear-gradient(135deg,#1E1B4B,#4338CA)" }}>
                <span className="ab-tag">👟 Footwear</span>
                <h3>New Arrivals</h3>
                <p>Fresh styles from top brands</p>
                <span className="ab-cta">Explore →</span>
              </Link>
              <Link to="/babycare" className="ad-banner" style={{ background: "linear-gradient(135deg,#0C4A6E,#0369A1)" }}>
                <span className="ab-tag">👶 Baby Week</span>
                <h3>Free Diaper Pack</h3>
                <p>On orders above ₹999</p>
                <span className="ab-cta">Shop Baby →</span>
              </Link>
            </div>
          </div>

          {/* ── PET CARE ── */}
          <div className="section-wrap">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Furry Friends</span>
                <h2 className="sec-title">🐾 Pet Care Essentials</h2>
              </div>
              <Link to="/petcare" className="see-all-btn">View All →</Link>
            </div>
            <div className="strip-layout">
              <Link to="/petcare" className="strip-promo" style={{ "--sp-from": "#451A03", "--sp-to": "#92400E", "--sp-acc": "#FCD34D" }}>
                <span className="sp-tag">For Your Furry Friend</span>
                <h3>Pet Food &<br />Accessories</h3>
                <p>Buy 2 Get 1 on pet food</p>
                <span className="sp-cta">Shop Pet Care →</span>
                <div className="sp-bg-icon">🐾</div>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : (products.pet || []).slice(0, 4).map((item, i) => (
                  <PCard key={item.id} item={item} index={i + 10} onCart={handleAddCart} compact />
                ))}
              </div>
            </div>
          </div>

          {/* ── FASHION & SHOES ── */}
          <div className="section-wrap fashion-section">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Style</span>
                <h2 className="sec-title">👗 Fashion & Footwear</h2>
              </div>
              <Link to="/Products" className="see-all-btn">View All →</Link>
            </div>
            {loading ? <Skelly /> : (
              <Slider {...carouselSettings(5)} className="prod-slider">
                {[...(products.fashion || []), ...(products.shoes || [])].slice(0, 16).map((item, i) => (
                  <PCard key={item.id + i} item={item} index={i + 60} onCart={handleAddCart} />
                ))}
              </Slider>
            )}
          </div>

          {/* ── BABY CARE ── */}
          <div className="section-wrap">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Safe & Trusted</span>
                <h2 className="sec-title">👶 Baby Care Must-Haves</h2>
              </div>
              <Link to="/babycare" className="see-all-btn">View All →</Link>
            </div>
            <div className="strip-layout">
              <Link to="/babycare" className="strip-promo" style={{ "--sp-from": "#0C4A6E", "--sp-to": "#1D4ED8", "--sp-acc": "#93C5FD" }}>
                <span className="sp-tag">Pediatrician Approved</span>
                <h3>Baby<br />Essentials</h3>
                <p>Free diaper pack on ₹999+</p>
                <span className="sp-cta">Shop Baby →</span>
                <div className="sp-bg-icon">👶</div>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : (products.baby || []).slice(0, 4).map((item, i) => (
                  <PCard key={item.id} item={item} index={i + 20} onCart={handleAddCart} compact />
                ))}
              </div>
            </div>
          </div>

          {/* ── COMING SOON ── */}
          <div className="section-wrap upcoming-section">
            <div className="sec-header">
              <div>
                <span className="sec-eyebrow">Dropping Soon</span>
                <h2 className="sec-title">🚀 Coming Soon</h2>
              </div>
            </div>
            {loading ? <Skelly /> : upcoming.length > 0 ? (
              <Slider {...carouselSettings(5)} className="prod-slider">
                {upcoming.slice(0, 12).map((item, i) => (
                  <PCard key={item.id + "cs"} item={item} index={i + 80} onCart={handleAddCart} showComing />
                ))}
              </Slider>
            ) : (
              /* fallback: use ecommerce products */
              <Slider {...carouselSettings(5)} className="prod-slider">
                {(products.ecommerce || []).slice(5, 17).map((item, i) => (
                  <PCard key={item.id + "cs"} item={item} index={i + 80} onCart={handleAddCart} showComing />
                ))}
              </Slider>
            )}
          </div>

          {/* ── WHY US ── */}
          <div className="section-wrap why-section">
            <div className="sec-header" style={{ justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <span className="sec-eyebrow">Our Promise</span>
                <h2 className="sec-title">Why Choose QuickKart?</h2>
              </div>
            </div>
            <div className="why-grid">
              {whyUs.map((w, i) => (
                <div key={i} className="why-card" style={{ "--wc": w.color }}>
                  <div className="why-icon">{w.icon}</div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── BRANDS ── */}
          <div className="brands-section">
            <div className="section-wrap">
              <h3 className="brands-title">Trusted Brands We Carry</h3>
              <Slider {...brandSettings} className="brand-slider">
                {brands.map((b, i) => (
                  <div key={i} className="brand-tile"><span>{b}</span></div>
                ))}
              </Slider>
            </div>
          </div>

          {/* ── TESTIMONIALS ── */}
          <div className="section-wrap">
            <div className="sec-header" style={{ justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <span className="sec-eyebrow">Reviews</span>
                <h2 className="sec-title">What Our Customers Say</h2>
              </div>
            </div>
            <Slider {...carouselSettings(4)} className="testi-slider">
              {testimonials.map((t, i) => (
                <div key={i} className="testi-wrap">
                  <div className="testi-card">
                    <div className="testi-stars">{"★".repeat(t.rating)}</div>
                    <p className="testi-text">"{t.text}"</p>
                    <div className="testi-author">
                      <div className="testi-av" style={{ background: t.clr }}>{t.av}</div>
                      <div>
                        <strong>{t.name}</strong>
                        <span>📍 {t.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* ── APP DOWNLOAD ── */}
          <div className="app-section">
            <div className="section-wrap app-inner">
              <div className="app-text">
                <span className="sec-eyebrow" style={{ color: "#475569" }}>Get the App</span>
                <h2>Shop Faster on Our App</h2>
                <p>Exclusive app-only deals, real-time order tracking & one-tap reorder</p>
                <div className="app-btns">
                  <button className="app-btn"><span>📱</span> App Store</button>
                  <button className="app-btn"><span>🤖</span> Play Store</button>
                </div>
              </div>
              <div className="app-mockup">
                <div className="app-phone-frame">
                  <span>📲</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── NEWSLETTER ── */}
          <div className="nl-section">
            <div className="nl-inner">
              <span className="nl-icon">📬</span>
              <h2>Stay in the Loop</h2>
              <p>Subscribe for exclusive deals, new arrivals & health tips weekly</p>
              <div className="nl-form">
                <input type="email" placeholder="Enter your email address" />
                <button>Subscribe →</button>
              </div>
              <span className="nl-note">No spam ever. Unsubscribe anytime.</span>
            </div>
          </div>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
  <div className="footer-inner">
    <div className="footer-top">
      <div className="ft-brand">
        <h3>🛒 QuickKart</h3>
        <p>Your trusted daily needs partner. Fast delivery, great prices — across India.</p>
        <div className="social-row">
          {["📘","📸","🐦","▶️"].map((s, i) => (
            <a key={i} href="#" className="soc-icon">{s}</a>
          ))}
        </div>
      </div>

      {[
        { title: "Shop", links: [{ l:"All Products",link:"/Products"},{ l:"Pharmacy",link:"/pharmacy"},{ l:"Pet Care",link:"/petcare"},{ l:"Baby Care",link:"/babycare"}] },
        { title: "Help", links: [{ l:"Track Order",link:"#"},{ l:"Returns",link:"#"},{ l:"Help Center",link:"#"},{ l:"Contact Us",link:"#"}] },
      ].map((col, i) => (
        <div key={i} className="ft-links">
          <h4>{col.title}</h4>
          <ul>
            {col.links.map((lk, j) => (
              <li key={j}>
                <Link to={lk[1] || "#"}>{lk.l}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="ft-links">
        <h4>Contact</h4>
        <ul>
          <li>📧 support@quickkart.com</li>
          <li>{"📞 1800-123-4567"}</li>
          <li>🕐 Mon-Sat 9AM-8PM</li>
          <li>📍 Bengaluru, India</li>
        </ul>
      </div>

    </div>

    <div className="footer-bottom">
      <p>© 2026 QuickKart. All rights reserved.</p>
      <div className="pay-icons">
        {["💳 Visa","💳 Mastercard","📱 UPI","💰 COD","🏦 NetBanking"].map((p, i) => (
          <span key={i}>{p}</span>
        ))}
      </div>
    </div>
  </div>
</footer>
</section>
);
};

export default Home;