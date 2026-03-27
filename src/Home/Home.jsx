import { Link } from "react-router-dom";
import "./Home.css";
import { useContext } from "react";
import { searchvalue } from "../App";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const search = useContext(searchvalue);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: false,
  };

  const productSettings = {
    dots: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const comingProducts = [
    {
      name: "Organic Honey",
      price: 299,
      old: 499,
      img: "https://zanducare.com/cdn/shop/articles/Zanducare_-_2024-04-23T160433.165.png?v=1756200527",
    },
    {
      name: "Dog Food Pack",
      price: 899,
      old: 1200,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM-OeDkbwAeQ_oydGi5D4v1Qpt1Rw79HN0bQ&s",
    },
    {
      name: "Womens Dress",
      price: 199,
      old: 350,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNLptx_OrzchjaskbzZHu8Iehxjx2dB8romw&s",
    },
    {
      name: "Food Items",
      price: 499,
      old: 799,
      img: "https://blog.swiggy.com/wp-content/uploads/2024/09/Image-4_Spring-Rolls-1024x538.png",
    },
    {
      name: "Mens Shirts",
      price: 149,
      old: 299,
      img: "https://cottonfolk.in/cdn/shop/files/Men_sBrownPinstripeShort-SleeveShirt.jpg?v=1732268509&width=2048",
    },
  ];

  const categories = [
    {
      name: "Pharmacy",
      desc: "Medicines & health essentials",
      color: "green",
      icon: "💊",
    },
    {
      name: "Pet Care",
      desc: "Food, treats & accessories",
      color: "yellow",
      icon: "🐶",
    },
    {
      name: "Baby Care",
      desc: "Diapers & baby essentials",
      color: "blue",
      icon: "👶",
    },
  ];

  const getLink = (name) => {
    if (name === "Pet Care") return "/petcare";
    if (name === "Pharmacy") return "/pharmacy";
    if (name === "Baby Care") return "/babycare";
    return "/Products";
  };

  return (
    <section className="home">
      {!search && (
        <>
          <Slider {...settings} className="hero-slider">
            <div className="hero-slide">
              <Link to="/Products">
              <img
                src="https://i0.wp.com/dailyneeds247.com/wp-content/uploads/2025/12/DN247.jpeg?fit=1200%2C400&ssl=1"
                className="bg-img"
                alt=""
              />
              <div className="overlay"></div>
              <div className="hero-content">
                <h1>Stock up on daily essentials</h1>
                <p>Fresh groceries delivered in minutes</p>
                <Link to="/Products" className="shop-btn">
                  Shop Now
                </Link>
              </div>
              </Link>
            </div>

            <div className="hero-slide">
              <Link to="/PetCare">

              <img
                src="https://thumbs.dreamstime.com/z/flat-lay-composition-food-snacks-toys-accessories-dog-cat-bright-background-pet-care-shopping-sale-concept-top-405066714.jpg"
                className="bg-img"
                alt=""
              />
              <div className="overlay"></div>
              <div className="hero-content">
                <h1>Best Deals on Pet Care</h1>
                <p>Food, toys & accessories</p>
                <Link to="/petcare" className="shop-btn">
                  Explore
                </Link>
              </div>
              </Link>
            </div>

            <div className="hero-slide">
              <Link to="/Babycare">

              <img
                src="https://cittaworld.com/cdn/shop/articles/10_Essential_Baby_Items_Every_New_Parent_Needs-5198001_cd1fa34b-77af-40fe-816e-2821b5484117.jpg?v=1772190034"
                className="bg-img"
                alt=""
              />
              <div className="overlay"></div>
              <div className="hero-content">
                <h1>Baby Care Essentials</h1>
                <p>Safe & trusted products</p>
                <Link to="/babycare" className="shop-btn">
                  Shop Now
                </Link>
              </div>
              </Link>
            </div>
          </Slider>

          {/* 🧾 CATEGORY */}
          <div className="categories">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={getLink(cat.name)}
                className={`cat-card ${cat.color}`}
              >
                <h3>
                  {cat.icon} {cat.name}
                </h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>

          <h2 className="section-title">🔥 Coming Soon</h2>

          <Slider {...productSettings} className="product-slider">
            {comingProducts.map((item, index) => {
              const discount = Math.round(
                ((item.old - item.price) / item.old) * 100,
              );

              return (
                <div key={index} className="product-wrapper">
                  <div className="product-card">
                    <div className="product-img">
                      <img src={item.img} alt="" />

                      <span className="badge">-{discount}%</span>
                      <span className="wishlist">♡</span>
                    </div>

                    <div className="product-info">
                      <h4>{item.name}</h4>

                      <div className="rating">
                        ⭐ 4.4 <span>(1200)</span>
                      </div>

                      <p className="price">
                        ₹{item.price} <span>₹{item.old}</span>
                      </p>

                      <button className="coming-btn">Coming Soon</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>

          <div className="features">
            <div>
              <h4>⚡ Fast Delivery</h4>
              <p>Get your order delivered quickly</p>
            </div>

            <div>
              <h4>🛒 Smart Cart</h4>
              <p>Add, remove & update quantity easily</p>
            </div>

            <div>
              <h4>🔒 Secure</h4>
              <p>Safe checkout experience</p>
            </div>
          </div>
        </>
      )}

      <footer className="footer">
        <p>© 2026 My Shopping Website</p>
      </footer>
    </section>
  );
};

export default Home;
