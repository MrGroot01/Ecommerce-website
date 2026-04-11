import { Link } from "react-router-dom";
import "./Home.css";
import { useContext, useState, useEffect, useRef } from "react";
import { searchvalue, cart_data } from "../App";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

/* ── API endpoints ── */
const API_MAP = {
  pharmacy:  "https://pharmacyapi-1.onrender.com/api/",
  pet:       "https://petcare-byc5.onrender.com/api/",
  baby:      "https://babycare-tawz.onrender.com/api/",
  ecommerce: "https://ecommerceapidata.onrender.com/api/",
};

const normalise = (item, category) => ({
  id:       String(item.id || item._id || item.name || Math.random()).toLowerCase(),
  name:     item.name  || item.title  || "Product",
  price:    item.price || item.cost   || 0,
  image:    item.image || item.images || "",
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

/* ── Ad Banner (sidebar) ── */
const SideAd = ({ ad }) => (
  <Link to={ad.link} className={`side-ad ${ad.theme}`}>
    <span className="side-ad-tag">{ad.tag}</span>
    <div className="side-ad-icon">{ad.icon}</div>
    <h4>{ad.title}</h4>
    <p>{ad.sub}</p>
    <span className="side-ad-cta">{ad.cta} →</span>
  </Link>
);

/* ── Star Row ── */
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="stars-row">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`s ${i < full ? "on" : "off"}`} viewBox="0 0 20 20">
          <path d="M10 1l2.39 4.84L18 6.76l-4 3.9.94 5.5L10 13.77l-4.94 2.39.94-5.5-4-3.9 5.61-.92z" />
        </svg>
      ))}
      <span className="rating-val">{rating}</span>
    </div>
  );
};

/* ── Product Card ── */
const PCard = ({ item, index, onCart, showComing = false }) => {
  const [wished, setWished] = useState(false);
  const [added,  setAdded]  = useState(false);
  const fakeOld    = Math.round(item.price * (1.18 + (index % 25) / 100));
  const discount   = Math.round(((fakeOld - item.price) / fakeOld) * 100);
  const fakeRating = parseFloat((4.1 + ((index * 13) % 9) / 10).toFixed(1));
  const fakeRev    = 120 + (index * 77) % 4000;

  const handleAdd = () => {
    onCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pc-wrap">
      <div className={`pc ${showComing ? "pc-coming" : ""}`}>
        <div className="pc-img">
          <img
            src={item.image} alt={item.name}
            onError={e => { e.target.src = "https://placehold.co/240x240?text=No+Image"; }}
          />
          {showComing && (
            <div className="coming-overlay"><span>Coming Soon</span></div>
          )}
          {!showComing && (
            <button
              className={`wl-btn ${wished ? "wl-active" : ""}`}
              onClick={() => setWished(w => !w)}
            >
              <svg viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
          <span className="pc-badge">-{discount}%</span>
        </div>

        <div className="pc-body">
          <p className="pc-cat">{item.category}</p>
          <h4 className="pc-name" title={item.name}>
            {item.name.length > 24 ? item.name.slice(0, 24) + "…" : item.name}
          </h4>
          <Stars rating={fakeRating} />
          <span className="pc-reviews">({fakeRev.toLocaleString()} reviews)</span>
          <div className="pc-price-row">
            <span className="pc-price">₹{item.price}</span>
            <span className="pc-old">₹{fakeOld}</span>
            <span className="pc-save">Save ₹{fakeOld - item.price}</span>
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
          <div className="skelly-line short" />
          <div className="skelly-line" />
          <div className="skelly-line medium" />
          <div className="skelly-line btn" />
        </div>
      </div>
    ))}
  </div>
);

/* ════════════════════════════════
   MAIN HOME
════════════════════════════════ */
const Home = () => {
  const search  = useContext(searchvalue);
  const addCart = useContext(cart_data);

  const [cartNotif,   setCartNotif]   = useState(null);
  const [apiProducts, setApiProducts] = useState({ pharmacy:[], pet:[], baby:[], ecommerce:[] });
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const fetches = Object.entries(API_MAP).map(([key, url]) =>
      fetch(url)
        .then(r => r.json())
        .then(data => ({ key, data: data.map(i => normalise(i, key)) }))
        .catch(() => ({ key, data: [] }))
    );
    Promise.all(fetches).then(results => {
      const map = {};
      results.forEach(({ key, data }) => { map[key] = data; });
      setApiProducts(map);
      setLoading(false);
    });
  }, []);

  const handleAddCart = (item) => {
    addCart(item);
    setCartNotif(item.name);
    setTimeout(() => setCartNotif(null), 2500);
  };

  /* ── Slider configs ── */
  const heroSettings = {
    dots: true, infinite: true, speed: 800, autoplay: true,
    autoplaySpeed: 4500, arrows: false, fade: true, pauseOnHover: false,
  };
  const dealSettings = {
    dots: false, infinite: true, speed: 500, autoplay: true, autoplaySpeed: 3000,
    slidesToShow: 4, slidesToScroll: 1, arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 900,  settings: { slidesToShow: 2 } },
      { breakpoint: 560,  settings: { slidesToShow: 1 } },
    ],
  };
  const brandSettings = {
    dots: false, infinite: true, speed: 3000, autoplay: true, autoplaySpeed: 0,
    cssEase: "linear", slidesToShow: 7, slidesToScroll: 1, arrows: false,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 3 } }],
  };

  /* ── Static data ── */
  const heroSlides = [
    {
      bg: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
      img: "https://i0.wp.com/dailyneeds247.com/wp-content/uploads/2025/12/DN247.jpeg?fit=1200%2C400&ssl=1",
      eyebrow: "Daily Essentials",
      title: "Fresh Groceries\nDelivered in 15 Min",
      sub: "From farm to your doorstep, guaranteed fresh",
      cta: "Shop Now", link: "/Products",
      pill: "🚚 Free delivery above ₹499",
    },
    {
      bg: "linear-gradient(135deg,#1a0533,#3d1a6e,#6b21a8)",
      img: "https://thumbs.dreamstime.com/z/flat-lay-composition-food-snacks-toys-accessories-dog-cat-bright-background-pet-care-shopping-sale-concept-top-405066714.jpg",
      eyebrow: "Pet Care",
      title: "Best Deals on\nPet Products",
      sub: "Premium food, toys & accessories for your furry friend",
      cta: "Explore Pets", link: "/petcare",
      pill: "🐾 Up to 40% OFF",
    },
    {
      bg: "linear-gradient(135deg,#0a2c1a,#145232,#1a6b40)",
      img: "https://cittaworld.com/cdn/shop/articles/10_Essential_Baby_Items_Every_New_Parent_Needs-5198001_cd1fa34b-77af-40fe-816e-2821b5484117.jpg?v=1772190034",
      eyebrow: "Baby Care",
      title: "Trusted Baby\nEssentials",
      sub: "Safe & gentle — pediatrician approved products",
      cta: "Shop Baby", link: "/babycare",
      pill: "👶 Pediatrician Approved",
    },
  ];

  const categories = [
    { name:"Pharmacy",     icon:"💊", color:"grn",  link:"/pharmacy", count:"500+" },
    { name:"Pet Care",     icon:"🐾", color:"amb",  link:"/petcare",  count:"300+" },
    { name:"Baby Care",    icon:"👶", color:"blu",  link:"/babycare", count:"400+" },
    { name:"Groceries",    icon:"🥦", color:"grn2", link:"/Products", count:"1000+" },
    { name:"Personal Care",icon:"🧴", color:"pur",  link:"/Products", count:"200+" },
    { name:"Electronics",  icon:"📱", color:"red",  link:"/Products", count:"150+" },
  ];

  const sideAdsLeft = [
    { tag:"Pharmacy Deal", icon:"💊", title:"Flat 30% OFF", sub:"On all medicines & healthcare", cta:"Shop Now", link:"/pharmacy", theme:"ad-green" },
    { tag:"Today Only",    icon:"⚡", title:"Flash Sale",   sub:"Limited items, grab fast!",       cta:"View Deals", link:"/Products", theme:"ad-orange" },
    { tag:"Pet Special",   icon:"🐶", title:"Buy 2 Get 1",  sub:"On all pet food brands",         cta:"Shop Pets", link:"/petcare", theme:"ad-amber" },
  ];

  const sideAdsRight = [
    { tag:"New Arrival", icon:"👶", title:"Baby Essentials", sub:"Free diaper pack on ₹999+",  cta:"Shop Baby", link:"/babycare", theme:"ad-blue" },
    { tag:"Trending",    icon:"🌿", title:"Organic Range",   sub:"Farm fresh, 100% natural",   cta:"Explore", link:"/Products", theme:"ad-teal" },
    { tag:"Limited",     icon:"🎁", title:"Gift Hampers",    sub:"Curated sets from ₹499",    cta:"View All", link:"/Products", theme:"ad-purple" },
  ];

  const offerStrip = [
    { icon:"💊", title:"Flat 30% OFF", sub:"On medicines", color:"grn", link:"/pharmacy" },
    { icon:"🐶", title:"Buy 2 Get 1",  sub:"On pet food",  color:"amb", link:"/petcare"  },
    { icon:"👶", title:"Free Pack",    sub:"Orders ₹999+", color:"blu", link:"/babycare" },
    { icon:"🛒", title:"₹100 OFF",     sub:"On ₹599+",     color:"pur", link:"/Products" },
  ];

  const brands = ["Himalaya","Pedigree","Pampers","Nestlé","Johnson's","Dabur","Dove","Colgate","Similac","Whiskas","Cipla","Huggies"];

  const testimonials = [
    { name:"Priya S.",  city:"Bengaluru", text:"Super fast delivery! Got my medicines within 30 mins. The app is incredibly easy to use.", rating:5, av:"P", clr:"grn" },
    { name:"Rahul M.",  city:"Mumbai",    text:"Best prices for pet food. My dog loves the Pedigree pack I ordered. Will definitely order again!", rating:5, av:"R", clr:"amb" },
    { name:"Anita K.",  city:"Delhi",     text:"Trusted brand, quality products. Baby diapers are always in stock here. Highly recommend.", rating:4, av:"A", clr:"blu" },
    { name:"Suresh T.", city:"Chennai",   text:"The pharmacy section saved me a trip to the store. Same-day delivery worked perfectly.", rating:5, av:"S", clr:"pur" },
  ];

  const featuredDeals = [
    ...apiProducts.pharmacy.slice(0, 2),
    ...apiProducts.pet.slice(0, 2),
    ...apiProducts.baby.slice(0, 2),
    ...apiProducts.ecommerce.slice(0, 2),
  ];

  const comingSoon = [
    ...apiProducts.baby.slice(2, 4),
    ...apiProducts.pet.slice(2, 4),
    ...apiProducts.pharmacy.slice(4, 6),
  ];

  /* ── Section with sidebar ads ── */
  const SectionWithAds = ({ title, viewAllLink, leftAd, rightAd, children, timer = false }) => (
    <div className="section-with-ads">
      <div className="sad-left">
        {leftAd && <SideAd ad={leftAd} />}
      </div>
      <div className="sad-main">
        <div className="sec-header">
          <div className="sec-header-left">
            <h2 className="sec-title">{title}</h2>
            {timer && (
              <div className="sec-timer">
                <span className="timer-label">Ends in</span>
                <CountdownTimer />
              </div>
            )}
          </div>
          {viewAllLink && <Link to={viewAllLink} className="view-all-btn">View All →</Link>}
        </div>
        {children}
      </div>
      <div className="sad-right">
        {rightAd && <SideAd ad={rightAd} />}
      </div>
    </div>
  );

  return (
    <section className="home">
      {cartNotif && (
        <div className="cart-toast">
          <span className="toast-icon">✅</span>
          <span><strong>{cartNotif.length > 22 ? cartNotif.slice(0, 22) + "…" : cartNotif}</strong> added to cart!</span>
        </div>
      )}

      {!search && (
        <>
          {/* ANNOUNCEMENT BAR */}
          <div className="announce-bar">
            <div className="announce-inner">
              <span>🎉 Free delivery on orders above ₹499</span>
              <span className="ann-sep" />
              <span>⚡ 15-min delivery in select areas</span>
              <span className="ann-sep" />
              <span>🔒 100% Secure Payments</span>
              <span className="ann-sep" />
              <span>↩️ 7-day easy returns</span>
            </div>
          </div>

          {/* HERO */}
          <div className="hero-wrap">
            <Slider {...heroSettings} className="hero-slider">
              {heroSlides.map((s, i) => (
                <div key={i}>
                  <div className="hero-slide" style={{ background: s.bg }}>
                    <div className="hero-img-bg" style={{ backgroundImage: `url(${s.img})` }} />
                    <div className="hero-gradient" />
                    <div className="hero-content">
                      <span className="hero-eyebrow">{s.eyebrow}</span>
                      <h1 className="hero-title">
                        {s.title.split("\n").map((t, j) => <span key={j}>{t}<br /></span>)}
                      </h1>
                      <p className="hero-sub">{s.sub}</p>
                      <div className="hero-actions">
                        <Link to={s.link} className="hero-cta">{s.cta} →</Link>
                        <span className="hero-pill">{s.pill}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* OFFER STRIP */}
          <div className="offer-strip-wrap">
            <div className="offer-strip">
              {offerStrip.map((o, i) => (
                <Link key={i} to={o.link} className={`offer-tile ${o.color}`}>
                  <span className="ot-icon">{o.icon}</span>
                  <div>
                    <strong>{o.title}</strong>
                    <p>{o.sub}</p>
                  </div>
                  <span className="ot-arrow">›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="section-with-ads categories-section">
            <div className="sad-left">
              <SideAd ad={sideAdsLeft[0]} />
            </div>
            <div className="sad-main">
              <div className="sec-header">
                <h2 className="sec-title">Shop by Category</h2>
                <Link to="/Products" className="view-all-btn">See All →</Link>
              </div>
              <div className="cat-grid">
                {categories.map((c, i) => (
                  <Link key={i} to={c.link} className={`cat-tile ct-${c.color}`}>
                    <div className="ct-icon">{c.icon}</div>
                    <div className="ct-body">
                      <h4>{c.name}</h4>
                      <span>{c.count} products</span>
                    </div>
                    <span className="ct-arrow">›</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="sad-right">
              <SideAd ad={sideAdsRight[0]} />
            </div>
          </div>

          {/* TODAY'S DEALS */}
          <SectionWithAds
            title="🔥 Today's Top Deals"
            viewAllLink="/Products"
            leftAd={sideAdsLeft[1]}
            rightAd={sideAdsRight[1]}
            timer
          >
            {loading ? <Skelly /> : (
              <Slider {...dealSettings} className="deal-slider">
                {featuredDeals.map((item, i) => (
                  <PCard key={item.id + i} item={item} index={i} onCart={handleAddCart} />
                ))}
              </Slider>
            )}
          </SectionWithAds>

          {/* PHARMACY SECTION */}
          <SectionWithAds
            title="💊 Pharmacy Picks"
            viewAllLink="/pharmacy"
            leftAd={sideAdsLeft[2]}
            rightAd={sideAdsRight[2]}
          >
            <div className="strip-layout">
              <Link to="/pharmacy" className="strip-banner strip-green">
                <span className="sb-tag">Health & Wellness</span>
                <h3>Medicines &amp; Healthcare</h3>
                <p>Flat 30% OFF on select medicines</p>
                <span className="sb-cta">Shop Pharmacy →</span>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : apiProducts.pharmacy.slice(0, 3).map((item, i) => (
                  <PCard key={item.id} item={item} index={i} onCart={handleAddCart} />
                ))}
              </div>
            </div>
          </SectionWithAds>

          {/* PET CARE */}
          <SectionWithAds title="🐾 Pet Care Essentials" viewAllLink="/petcare">
            <div className="strip-layout">
              <Link to="/petcare" className="strip-banner strip-amber">
                <span className="sb-tag">For Your Furry Friend</span>
                <h3>Pet Food &amp; Accessories</h3>
                <p>Buy 2 Get 1 Free on pet food</p>
                <span className="sb-cta">Shop Pet Care →</span>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : apiProducts.pet.slice(0, 3).map((item, i) => (
                  <PCard key={item.id} item={item} index={i + 10} onCart={handleAddCart} />
                ))}
              </div>
            </div>
          </SectionWithAds>

          {/* BABY CARE */}
          <SectionWithAds title="👶 Baby Care Must-Haves" viewAllLink="/babycare">
            <div className="strip-layout">
              <Link to="/babycare" className="strip-banner strip-blue">
                <span className="sb-tag">Safe & Trusted</span>
                <h3>Baby Essentials</h3>
                <p>Free Diaper Pack on orders above ₹999</p>
                <span className="sb-cta">Shop Baby Care →</span>
              </Link>
              <div className="strip-cards">
                {loading ? <Skelly count={3} /> : apiProducts.baby.slice(0, 3).map((item, i) => (
                  <PCard key={item.id} item={item} index={i + 20} onCart={handleAddCart} />
                ))}
              </div>
            </div>
          </SectionWithAds>

          {/* PROMO BANNER */}
          <div className="promo-section">
            <div className="promo-card">
              <div className="promo-left">
                <span className="promo-eyebrow">Limited Time Offer</span>
                <h2>Get Flat <span>20% OFF</span><br />on Your First Order</h2>
                <p>Use code <strong>FIRST20</strong> at checkout. Valid on orders above ₹299.</p>
                <Link to="/Products" className="promo-cta">Claim Offer →</Link>
              </div>
              <div className="promo-right">
                <div className="promo-graphic">
                  <div className="pg-circle c1" />
                  <div className="pg-circle c2" />
                  <div className="pg-emoji">🎁</div>
                </div>
              </div>
            </div>
          </div>

          {/* COMING SOON */}
          <SectionWithAds title="🚀 Coming Soon">
            {loading ? <Skelly /> : (
              <Slider {...dealSettings} className="deal-slider">
                {comingSoon.map((item, i) => (
                  <PCard key={item.id + "cs"} item={item} index={i + 30} onCart={handleAddCart} showComing />
                ))}
              </Slider>
            )}
          </SectionWithAds>

          {/* BRANDS */}
          <div className="brands-section">
            <div className="brands-inner">
              <h3 className="brands-title">Trusted Brands</h3>
              <Slider {...brandSettings} className="brand-slider">
                {brands.map((b, i) => (
                  <div key={i} className="brand-tile"><span>{b}</span></div>
                ))}
              </Slider>
            </div>
          </div>

          {/* WHY US */}
          <div className="why-section">
            <div className="why-inner">
              <div className="sec-header centered">
                <h2 className="sec-title">Why Choose Us?</h2>
              </div>
              <div className="why-grid">
                {[
                  { icon:"⚡", title:"30-Min Delivery",    desc:"Get your order blazing fast within select areas. Guaranteed freshness on every drop.",    clr:"grn"  },
                  { icon:"🛡️", title:"100% Secure",        desc:"End-to-end encrypted payments. We never store your card details.",                        clr:"blu"  },
                  { icon:"↩️", title:"Easy Returns",       desc:"7-day hassle-free return policy. No questions asked, no complicated forms.",               clr:"amb"  },
                  { icon:"💰", title:"Best Price Promise",  desc:"We compare 1000+ sellers to bring you the lowest price, every single time.",              clr:"pur"  },
                ].map((f, i) => (
                  <div key={i} className={`why-card wc-${f.clr}`}>
                    <div className="why-icon">{f.icon}</div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div className="testi-section">
            <div className="testi-inner">
              <div className="sec-header centered">
                <h2 className="sec-title">What Our Customers Say</h2>
              </div>
              <div className="testi-grid">
                {testimonials.map((t, i) => (
                  <div key={i} className="testi-card">
                    <div className="testi-quote">"</div>
                    <p className="testi-text">{t.text}</p>
                    <div className="testi-footer">
                      <div className={`testi-av av-${t.clr}`}>{t.av}</div>
                      <div>
                        <strong>{t.name}</strong>
                        <span className="testi-city">📍 {t.city}</span>
                      </div>
                      <div className="testi-stars">{"★".repeat(t.rating)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* APP DOWNLOAD */}
          <div className="app-section">
            <div className="app-inner">
              <div className="app-text">
                <span className="app-eyebrow">Available on all platforms</span>
                <h2>Download Our App</h2>
                <p>Shop faster, get exclusive app-only deals and track your orders in real time.</p>
                <div className="app-btns">
                  <button className="app-btn"><span>📱</span> App Store</button>
                  <button className="app-btn"><span>🤖</span> Play Store</button>
                </div>
              </div>
              <div className="app-visual">
                <div className="app-phone">📲</div>
              </div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="nl-section">
            <div className="nl-inner">
              <h2>Stay in the Loop 📬</h2>
              <p>Subscribe for exclusive deals, new arrivals &amp; health tips delivered weekly</p>
              <div className="nl-form">
                <input type="email" placeholder="Enter your email address" />
                <button>Subscribe →</button>
              </div>
              <span className="nl-note">No spam ever. Unsubscribe anytime.</span>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="ft-brand">
              <h3>🛒 QuickKart</h3>
              <p>Your trusted daily needs partner. Fast delivery, great prices, happy customers across India.</p>
              <div className="social-row">
  <a href="#" className="social-icon"><FaFacebookF /></a>

  <a href="#" className="social-icon"><FaXTwitter /></a>

  <a href="#" className="social-icon"><FaInstagram /></a>

  <a 
    href="https://www.linkedin.com/in/kirandt/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-icon"
  >
    <FaLinkedinIn />
  </a>

  <a 
    href="https://github.com/MrGroot01" 
    target="_blank" 
    rel="noopener noreferrer"
    className="social-icon"
  >
    <FaGithub />
  </a>
</div>
            </div>
            <div className="ft-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/Products">All Products</Link></li>
                <li><Link to="/pharmacy">Pharmacy</Link></li>
                <li><Link to="/petcare">Pet Care</Link></li>
                <li><Link to="/babycare">Baby Care</Link></li>
              </ul>
            </div>
            <div className="ft-links">
              <h4>Customer Service</h4>
              <ul>
                <li><a href="/orders">Track Order</a></li>
                <li><a href="/returns">Returns & Refunds</a></li>
                <li><a href="/contact">Help Center</a></li>
                <li><a href="/contact">Contact Us</a></li>
              </ul>
            </div>
            <div className="ft-links">
              <h4>Contact</h4>
              <ul>
                <li>📧 kirand09876@gmail.com</li>
                <li>📞 +91 7483594153</li>
                <li>🕐 Mon–Sat 9AM–8PM</li>
                <li>📍 Bengaluru, India</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 QuickKart. All rights reserved.</p>
            <div className="pay-icons">
              {["💳 Visa","💳 Mastercard","📱 UPI","💰 COD","🏦 Net Banking"].map((p, i) => (
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