import React, { useContext, useEffect, useState } from "react";
import "./Products.css";
import { cart_data, f_data, searchvalue } from "../App";
import { useNavigate } from "react-router-dom";

const Products = () => {

  const data1 = useContext(f_data);
  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  const navigate = useNavigate();

  const [extraProducts, setExtraProducts] = useState([]);
  const [category, setCategory] = useState("all");

  const fetchExtraProducts = async () => {

    const urls = [
      "https://babycare-tawz.onrender.com/api/",
      "https://pharmacyapi-1.onrender.com/api/",
      "https://petcare-byc5.onrender.com/api/"
    ];

    const results = await Promise.allSettled(
      urls.map(url => fetch(url).then(res => res.json()))
    );

    const merged = [];

    results.forEach(result => {
      if (result.status === "fulfilled") {
        merged.push(...result.value);
      } else {
        console.error("API failed:", result.reason);
      }
    });

    setExtraProducts(merged);
  };

  useEffect(() => {
    fetchExtraProducts();
  }, []);

  /* MERGE ALL PRODUCTS */

  const allProducts = [...data1, ...extraProducts];

  /* SEARCH FILTER */

  const searchedProducts = allProducts.filter(item =>
    item.name?.toLowerCase().includes((search || "").toLowerCase())
  );

  /* CATEGORY FILTER */

  const filteredProducts =
    category === "all"
      ? searchedProducts
      : searchedProducts.filter(p => p.category === category);

  return (

    <div className="products-page">

      {/* CATEGORY MENU */}

     <div className="category-menu">

  <button onClick={() => setCategory("all")}>
    All
  </button>

  <button onClick={() => navigate("/vegetables")}>
    Vegetables
  </button>

  <button onClick={() => navigate("/fruits")}>
    Fruits
  </button>

  <button onClick={() => navigate("/pharmacy")}>
    Pharmacy
  </button>

  <button onClick={() => navigate("/petcare")}>
    Pet Care
  </button>

  <button onClick={() => navigate("/babycare")}>
    Baby Care
  </button>

</div>


      {/* PRODUCT GRID */}

      <div className="pro-container">

        {filteredProducts.map((ele, index) => (

          <div className="p_container" key={index}>

            <span className="pid">{index + 1}</span>

            <h3
              className="title"
              onClick={() =>
                navigate("/product-details", { state: ele })
              }
            >
              {ele.name}
            </h3>

            <img
              src={ele.image || ele.images}
              alt={ele.name}
              onClick={() =>
                navigate("/product-details", { state: ele })
              }
            />

            <h4 className="price">
              ₹ {Number(ele.price).toFixed(0)}
            </h4>

            <p>{ele.description}</p>

            <button
              className="cart-btn"
              onClick={() =>
                cart1({
                  ...ele,
                  id: "prod-" + index,
                  title: ele.name,
                  image: ele.image || ele.images
                })
              }
            >
              Add Cart
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Products;