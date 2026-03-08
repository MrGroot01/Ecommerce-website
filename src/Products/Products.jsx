import React, { useContext, useEffect, useState } from "react";
import "./Products.css";
import { cart_data, f_data, searchvalue } from "../App";

const Products = () => {

  const data1 = useContext(f_data);
  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  const [extraProducts, setExtraProducts] = useState([]);

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
  const filteredProducts = allProducts.filter(item =>
    item.name?.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="pro-container">

      {filteredProducts.map((ele, index) => (

        <div className="p_container" key={index}>

          <span className="pid">{index + 1}</span>

          <h3 className="title">{ele.name}</h3>

          {/* Support both image fields */}
          <img src={ele.image || ele.images} alt={ele.name} />

          <h4 className="price">₹ {Number(ele.price).toFixed(0)}</h4>

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
  );
};

export default Products;