import { Link } from "react-router-dom";
import "./Home.css";
import { useContext } from "react";
import { searchvalue } from "../App";

const Home = () => {
  const search = useContext(searchvalue);

  const categories = [
    {
      name: "Pharmacy",
      desc: "Medicines & health essentials",
      color: "green",
    },
    {
      name: "Pet Care",
      desc: "Food, treats & accessories",
      color: "yellow",
    },
    {
      name: "Baby Care",
      desc: "Diapers & baby essentials",
      color: "blue",
    },
  ];

  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const getLink = (name) => {
    if (name === "Pet Care") return "/petcare";
    if (name === "Pharmacy") return "/pharmacy";
    return "/Products";
  };

  return (
    <section className="home">
      {search && (
        <div className="search-results">
          <div className="categories">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <Link
                  key={index}
                  to={getLink(cat.name)}
                  className={`cat-card ${cat.color}`}
                >
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </Link>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        </div>
      )}

      {!search && (
        <>
          <div className="hero-banner">
            <div className="hero-text">
              <h1>Stock up on daily essentials</h1>

              <p>
                Get fresh groceries, snacks, household items and more delivered
                to your doorstep in minutes.
              </p>

              <Link to="/Products" className="shop-btn">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="categories">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to={getLink(cat.name)}
                className={`cat-card ${cat.color}`}
              >
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>

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
              <p>Safe and smooth checkout experience</p>
            </div>
          </div>
        </>
      )}

      <footer className="footer">
        <p>© 2026 My Shopping Website. All Rights Reserved.</p>
      </footer>
    </section>
  );
};

export default Home;
