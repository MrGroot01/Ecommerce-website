import { Link } from "react-router-dom";
import "./Home.css";
import { useContext, useState, useEffect } from "react";
import { searchvalue, cart_data } from "../App";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* ── API endpoints (same as Addcart.jsx) ── */
const API_MAP = {
  pharmacy: "https://pharmacyapi-1.onrender.com/api/",
  pet:      "https://petcare-byc5.onrender.com/api/",
  baby:     "https://babycare-tawz.onrender.com/api/",
  ecommerce:"https://ecommerceapidata.onrender.com/api/",
};

/* normalise any API shape → { id, name, price, image, category } */
const normalise = (item, category) => ({
  id:       String(item.id || item._id || item.name || Math.random()).toLowerCase(),
  name:     item.name  || item.title  || "Product",
  price:    item.price || item.cost   || 0,
  image:    item.image || item.images || "",
  category,
});

const Home = () => {
  const search   = useContext(searchvalue);
  const addCart  = useContext(cart_data);          // ← real cart adder from App.jsx

  const [wishlist,    setWishlist]    = useState([]);
  const [cartNotif,   setCartNotif]   = useState(null);
  const [apiProducts, setApiProducts] = useState({ pharmacy:[], pet:[], baby:[], ecommerce:[] });
  const [loading,     setLoading]     = useState(true);

  /* ── fetch all 4 APIs in parallel ── */
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

  /* helpers */
  const toggleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleAddCart = (item) => {
    addCart(item);
    setCartNotif(item.name);
    setTimeout(() => setCartNotif(null), 2200);
  };

  /* ── slick settings ── */
  const heroSettings = {
    dots: true, infinite: true, speed: 900, autoplay: true,
    autoplaySpeed: 4200, arrows: false, pauseOnHover: false, fade: true,
  };
  const productSettings = {
    dots: false, infinite: true, speed: 600, autoplay: true,
    autoplaySpeed: 2800, slidesToShow: 4, slidesToScroll: 1, arrows: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 768,  settings: { slidesToShow: 2 } },
      { breakpoint: 480,  settings: { slidesToShow: 1 } },
    ],
  };
  const brandSettings = {
    dots: false, infinite: true, speed: 3500, autoplay: true,
    autoplaySpeed: 0, cssEase: "linear", slidesToShow: 6,
    slidesToScroll: 1, arrows: false, pauseOnHover: false,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 3 } }],
  };

  /* ── static data ── */
  const heroSlides = [
    {
      img:   "https://i0.wp.com/dailyneeds247.com/wp-content/uploads/2025/12/DN247.jpeg?fit=1200%2C400&ssl=1",
      tag:   "Daily Essentials",
      title: "Stock up on\nEveryday Needs",
      sub:   "Fresh groceries delivered to your door",
      btn:   "Shop Now", link: "/Products",
      badge: "FREE Delivery Above ₹499",
    },
    {
      img:   "https://thumbs.dreamstime.com/z/flat-lay-composition-food-snacks-toys-accessories-dog-cat-bright-background-pet-care-shopping-sale-concept-top-405066714.jpg",
      tag:   "Pet Care",
      title: "Best Deals on\nPet Products",
      sub:   "Premium food, toys & accessories",
      btn:   "Explore Pets", link: "/petcare",
      badge: "Up to 40% OFF",
    },
    {
      img:   "https://cittaworld.com/cdn/shop/articles/10_Essential_Baby_Items_Every_New_Parent_Needs-5198001_cd1fa34b-77af-40fe-816e-2821b5484117.jpg?v=1772190034",
      tag:   "Baby Care",
      title: "Trusted Baby\nEssentials",
      sub:   "Safe, gentle products for your little one",
      btn:   "Shop Baby", link: "/babycare",
      badge: "Pediatrician Approved",
    },
  ];

  const categories = [
    { name:"Pharmacy",     desc:"Medicines & health",   color:"green",  icon:"💊", link:"/pharmacy", count:"500+ Products" },
    { name:"Pet Care",     desc:"Food & accessories",   color:"yellow", icon:"🐶", link:"/petcare",  count:"300+ Products" },
    { name:"Baby Care",    desc:"Diapers & essentials", color:"blue",   icon:"👶", link:"/babycare", count:"400+ Products" },
    { name:"Groceries",    desc:"Fresh & packaged",     color:"orange", icon:"🛒", link:"/Products", count:"1000+ Products" },
    { name:"Personal Care",desc:"Skin & hair care",     color:"purple", icon:"🧴", link:"/Products", count:"200+ Products" },
    { name:"Electronics",  desc:"Gadgets & devices",    color:"red",    icon:"📱", link:"/Products", count:"150+ Products" },
  ];

  const offerBanners = [
    { title:"Flat 30% OFF",      sub:"On all medicines",      color:"#e8f5e9", accent:"#2e7d32", icon:"💊", link:"/pharmacy" },
    { title:"Buy 2 Get 1 Free",  sub:"On pet food",           color:"#fff8e1", accent:"#f57f17", icon:"🐶", link:"/petcare"  },
    { title:"Free Diaper Pack",  sub:"On orders above ₹999",  color:"#e3f2fd", accent:"#1565c0", icon:"👶", link:"/babycare" },
  ];

  const brands = ["Himalaya","Pedigree","Pampers","Nestlé","Johnson's","Dabur","Dove","Colgate","Similac","Whiskas"];

  const testimonials = [
    { name:"Priya S.",  city:"Bengaluru", text:"Super fast delivery! Got my medicines within 30 mins. The app is so easy to use.",                rating:5, avatar:"P" },
    { name:"Rahul M.",  city:"Mumbai",    text:"Best prices for pet food. My dog loves the Pedigree pack I ordered. Will order again!",           rating:5, avatar:"R" },
    { name:"Anita K.",  city:"Delhi",     text:"Trusted brand, quality products. Baby diapers are always in stock here. Highly recommend.",      rating:4, avatar:"A" },
    { name:"Suresh T.", city:"Chennai",   text:"The pharmacy section saved me a trip to the store. Same-day delivery worked perfectly.",          rating:5, avatar:"S" },
  ];

  /* ── derived API slices ── */
  const featuredDeals = [
    ...apiProducts.pharmacy.slice(0, 2),
    ...apiProducts.pet.slice(0, 2),
    ...apiProducts.baby.slice(0, 2),
    ...apiProducts.ecommerce.slice(0, 2),
  ];
  const pharmacyDeals = apiProducts.pharmacy.slice(0, 4);
  const petDeals      = apiProducts.pet.slice(0, 4);
  const babyDeals     = apiProducts.baby.slice(0, 4);
  const topPicks      = [
    ...apiProducts.ecommerce.slice(0, 2),
    ...apiProducts.pharmacy.slice(2, 4),
  ];
  const comingSoon    = [
    ...apiProducts.baby.slice(2, 4),
    ...apiProducts.pet.slice(2, 4),
    ...apiProducts.pharmacy.slice(4, 6),
  ];

  /* ── reusable product card ── */
  const ProductCard = ({ item, index, showComing = false }) => {
    const isWished  = wishlist.includes(item.id);
    const fakeOld   = Math.round(item.price * (1.15 + (index % 30) / 100));
    const discount  = Math.round(((fakeOld - item.price) / fakeOld) * 100);
    const fakeRating = (4.1 + ((index * 13) % 9) / 10).toFixed(1);
    const fakeReviews = 120 + (index * 77) % 4000;

    return (
      <div className="product-wrapper">
        <div className={`product-card${showComing ? " coming" : ""}`}>
          <div className="product-img">
            <img
              src={item.image} alt={item.name}
              onError={e => { e.target.src = "https://placehold.co/200x200?text=No+Image"; }}
            />
            {showComing
              ? <div className="coming-overlay"><span>Coming Soon</span></div>
              : (
                <button
                  className={`wishlist${isWished ? " active" : ""}`}
                  onClick={() => toggleWishlist(item.id)}
                >{isWished ? "♥" : "♡"}</button>
              )
            }
            <span className="badge">-{discount}%</span>
          </div>

          <div className="product-info">
            <h4 title={item.name}>
              {item.name.length > 26 ? item.name.slice(0, 26) + "…" : item.name}
            </h4>
            <div className="rating">
              <span className="stars">{"★".repeat(Math.floor(fakeRating))}</span>
              <span className="rating-num">{fakeRating}</span>
              <span className="reviews">({fakeReviews.toLocaleString()})</span>
            </div>
            <div className="price-row">
              <span className="price-new">₹{item.price}</span>
              <span className="price-old">₹{fakeOld}</span>
              <span className="price-save">Save ₹{fakeOld - item.price}</span>
            </div>
            {showComing
              ? <button className="notify-btn">🔔 Notify Me</button>
              : <button className="add-cart-btn" onClick={() => handleAddCart(item)}>
                  + Add to Cart
                </button>
            }
          </div>
        </div>
      </div>
    );
  };

  /* ── skeleton loader ── */
  const Skeletons = ({ count = 4, cls = "" }) => (
    <div className={`skeleton-row ${cls}`}>
      {[...Array(count)].map((_, i) => <div key={i} className="skeleton-card" />)}
    </div>
  );

  return (
    <section className="home">
      {!search && (
        <>
          {/* CART TOAST */}
          {cartNotif && (
            <div className="cart-toast">
              ✅ <strong>{cartNotif.length > 22 ? cartNotif.slice(0, 22) + "…" : cartNotif}</strong> added to cart!
            </div>
          )}

          {/* ANNOUNCEMENT BAR */}
          <div className="announcement-bar">
            <span>🎉 Free delivery on orders above ₹499</span>
            <span className="divider">|</span>
            <span>⚡ 30-min delivery in select areas</span>
            <span className="divider">|</span>
            <span>🔒 100% Secure Payments</span>
          </div>

          {/* HERO */}
          <div className="hero-wrapper">
            <Slider {...heroSettings} className="hero-slider">
              {heroSlides.map((slide, i) => (
                <div key={i} className="hero-slide">
                  <img src={slide.img} className="bg-img" alt="" />
                  <div className="hero-overlay" />
                  <div className="hero-content">
                    <span className="hero-tag">{slide.tag}</span>
                    <h1>{slide.title.split("\n").map((t, j) => <span key={j}>{t}<br /></span>)}</h1>
                    <p>{slide.sub}</p>
                    <div className="hero-actions">
                      <Link to={slide.link} className="hero-btn primary">{slide.btn} →</Link>
                      <span className="hero-badge">{slide.badge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* OFFER BANNERS */}
          <div className="offer-banners">
            {offerBanners.map((b, i) => (
              <Link key={i} to={b.link} className="offer-card" style={{ background: b.color }}>
                <span className="offer-icon">{b.icon}</span>
                <div>
                  <strong style={{ color: b.accent }}>{b.title}</strong>
                  <p>{b.sub}</p>
                </div>
                <span className="offer-arrow" style={{ color: b.accent }}>→</span>
              </Link>
            ))}
          </div>

          {/* CATEGORIES */}
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/Products" className="see-all">See All →</Link>
          </div>
          <div className="categories">
            {categories.map((cat, i) => (
              <Link key={i} to={cat.link} className={`cat-card ${cat.color}`}>
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                  <span className="cat-count">{cat.count}</span>
                </div>
                <span className="cat-arrow">›</span>
              </Link>
            ))}
          </div>

          {/* TODAY'S TOP DEALS */}
          <div className="section-header">
            <h2 className="section-title">🔥 Today's Top Deals</h2>
            <div className="deal-timer">
              <span>Ends in</span>
              <CountdownTimer />
            </div>
          </div>
          {loading
            ? <Skeletons count={4} />
            : (
              <Slider {...productSettings} className="product-slider">
                {featuredDeals.map((item, i) => <ProductCard key={item.id + i} item={item} index={i} />)}
              </Slider>
            )
          }

          {/* PHARMACY SECTION */}
          <div className="section-header" style={{ marginTop: "2.5rem" }}>
            <h2 className="section-title">💊 Pharmacy Picks</h2>
            <Link to="/pharmacy" className="see-all">View All →</Link>
          </div>
          <div className="category-strip pharmacy-strip">
            <div className="strip-info green-strip">
              <span className="strip-tag">Health & Wellness</span>
              <h3>Medicines &amp; Healthcare</h3>
              <p>Flat 30% OFF on select medicines</p>
              <Link to="/pharmacy" className="strip-btn green-btn">Shop Pharmacy →</Link>
            </div>
            <div className="strip-products">
              {loading
                ? <Skeletons count={3} cls="small-skeleton" />
                : pharmacyDeals.map((item, i) => <ProductCard key={item.id} item={item} index={i} />)
              }
            </div>
          </div>

          {/* PET CARE */}
          <div className="section-header" style={{ marginTop: "2.5rem" }}>
            <h2 className="section-title">🐶 Pet Care Essentials</h2>
            <Link to="/petcare" className="see-all">View All →</Link>
          </div>
          <div className="category-strip pet-strip">
            <div className="strip-info yellow-strip">
              <span className="strip-tag">For Your Furry Friend</span>
              <h3>Pet Food &amp; Accessories</h3>
              <p>Buy 2 Get 1 Free on pet food</p>
              <Link to="/petcare" className="strip-btn yellow-btn">Shop Pet Care →</Link>
            </div>
            <div className="strip-products">
              {loading
                ? <Skeletons count={3} cls="small-skeleton" />
                : petDeals.map((item, i) => <ProductCard key={item.id} item={item} index={i + 10} />)
              }
            </div>
          </div>

          {/* BABY CARE */}
          <div className="section-header" style={{ marginTop: "2.5rem" }}>
            <h2 className="section-title">👶 Baby Care Must-Haves</h2>
            <Link to="/babycare" className="see-all">View All →</Link>
          </div>
          <div className="category-strip baby-strip">
            <div className="strip-info blue-strip">
              <span className="strip-tag">Safe &amp; Trusted</span>
              <h3>Baby Essentials</h3>
              <p>Free Diaper Pack on orders above ₹999</p>
              <Link to="/babycare" className="strip-btn blue-btn">Shop Baby Care →</Link>
            </div>
            <div className="strip-products">
              {loading
                ? <Skeletons count={3} cls="small-skeleton" />
                : babyDeals.map((item, i) => <ProductCard key={item.id} item={item} index={i + 20} />)
              }
            </div>
          </div>

          {/* TOP PICKS */}
          <div className="section-header" style={{ marginTop: "2.5rem" }}>
            <h2 className="section-title">⭐ Top Picks for You</h2>
            <Link to="/Products" className="see-all">View All →</Link>
          </div>
          <div className="top-picks-grid">
            {loading
              ? [...Array(4)].map((_, i) => <div key={i} className="skeleton-card tall" />)
              : topPicks.slice(0, 4).map((item, i) => {
                  const fakeOld   = Math.round(item.price * (1.25 + i * 0.05));
                  const disc      = Math.round(((fakeOld - item.price) / fakeOld) * 100);
                  const fakeRating = (4.1 + i * 0.15).toFixed(1);
                  const fakeRev   = 300 + i * 900;
                  return (
                    <div key={item.id} className="pick-card">
                      <div className="pick-img">
                        <img src={item.image} alt={item.name}
                          onError={e => { e.target.src = "https://placehold.co/200x200?text=No+Image"; }} />
                        <span className="pick-discount">-{disc}%</span>
                        <span className="pick-cat">{item.category}</span>
                      </div>
                      <div className="pick-info">
                        <h4>{item.name.length > 28 ? item.name.slice(0, 28) + "…" : item.name}</h4>
                        <div className="rating">
                          <span className="stars">{"★".repeat(Math.floor(fakeRating))}</span>
                          <span className="rating-num">{fakeRating}</span>
                          <span className="reviews">({fakeRev.toLocaleString()})</span>
                        </div>
                        <div className="price-row">
                          <span className="price-new">₹{item.price}</span>
                          <span className="price-old">₹{fakeOld}</span>
                        </div>
                        <button className="add-cart-btn outline" onClick={() => handleAddCart(item)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })
            }
          </div>

          {/* PROMO BANNER */}
          <div className="promo-banner">
            <div className="promo-content">
              <span className="promo-label">Limited Time Offer</span>
              <h2>Get Flat 20% OFF on Your First Order</h2>
              <p>Use code <strong>FIRST20</strong> at checkout</p>
              <Link to="/Products" className="promo-btn">Claim Offer →</Link>
            </div>
            <div className="promo-img-wrap">🎁</div>
          </div>

          {/* COMING SOON */}
          <div className="section-header" style={{ marginTop: "2.5rem" }}>
            <h2 className="section-title">🚀 Coming Soon</h2>
            <span className="coming-sub">Notify me when available</span>
          </div>
          {loading
            ? <Skeletons count={4} />
            : (
              <Slider {...productSettings} className="product-slider">
                {comingSoon.map((item, i) => (
                  <ProductCard key={item.id + "cs"} item={item} index={i + 30} showComing />
                ))}
              </Slider>
            )
          }

          {/* BRANDS */}
          <div className="brands-section">
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "1.2rem" }}>
              Trusted Brands
            </h2>
            <Slider {...brandSettings} className="brand-slider">
              {brands.map((b, i) => (
                <div key={i} className="brand-item"><span>{b}</span></div>
              ))}
            </Slider>
          </div>

          {/* WHY CHOOSE US */}
          <div className="why-section">
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>Why Choose Us?</h2>
            <div className="features">
              {[
                { icon:"⚡", title:"Fast Delivery",  desc:"Get your order in 30 minutes within select areas. Same-day delivery guaranteed." },
                { icon:"🛒", title:"Smart Cart",      desc:"Easily add, remove and update quantities. Save items for later with wishlist."   },
                { icon:"🔒", title:"100% Secure",     desc:"End-to-end encrypted payments. Your data is always safe with us."               },
                { icon:"↩️", title:"Easy Returns",    desc:"7-day hassle-free return policy on all eligible products. No questions asked."  },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div className="testimonials-section">
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "2rem" }}>What Customers Say</h2>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="test-header">
                    <div className="test-avatar">{t.avatar}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <p className="test-city">📍 {t.city}</p>
                    </div>
                    <div className="test-stars">{"★".repeat(t.rating)}</div>
                  </div>
                  <p className="test-text">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* APP DOWNLOAD */}
          <div className="app-banner">
            <div className="app-text">
              <h2>Download Our App</h2>
              <p>Get exclusive app-only deals. Shop faster, smarter.</p>
              <div className="app-btns">
                <button className="app-store-btn">📱 App Store</button>
                <button className="app-store-btn">🤖 Play Store</button>
              </div>
            </div>
            <div className="app-mockup">📲</div>
          </div>

          {/* NEWSLETTER */}
          <div className="newsletter-section">
            <h2>Stay in the Loop</h2>
            <p>Subscribe for exclusive deals, new arrivals &amp; health tips</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button>Subscribe →</button>
            </div>
          </div>
        </>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>🛒 MyShop</h3>
            <p>Your trusted daily needs partner. Fast delivery, great prices, happy customers.</p>
            <div className="social-links">
              <a href="#">📘</a><a href="#">📸</a><a href="#">🐦</a><a href="#">▶️</a>
            </div>
          </div>
          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/Products">All Products</Link></li>
              <li><Link to="/pharmacy">Pharmacy</Link></li>
              <li><Link to="/petcare">Pet Care</Link></li>
              <li><Link to="/babycare">Baby Care</Link></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns &amp; Refunds</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-links-group">
            <h4>Contact</h4>
            <ul>
              <li>📧 support@myshop.com</li>
              <li>📞 1800-123-4567</li>
              <li>🕐 Mon–Sat 9AM–8PM</li>
              <li>📍 Bengaluru, India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 My Shopping Website. All rights reserved.</p>
          <div className="payment-icons">
            <span>💳 Visa</span><span>💳 Mastercard</span>
            <span>📱 UPI</span><span>💰 COD</span>
          </div>
        </div>
      </footer>
    </section>
  );
};

/* Countdown Timer */
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
      <span>{pad(time.h)}</span>:<span>{pad(time.m)}</span>:<span>{pad(time.s)}</span>
    </div>
  );
};

export default Home;
