import React, { useContext } from "react";
import "./Products.css";
import { cart_data, f_data } from "../App";

const Products = () => {
  const data1 = useContext(f_data);
  const cart1 = useContext(cart_data);

  return (
    <div className="pro-container">
      {data1.map((ele) => (
        <div className="p_container" key={ele.id}>
          <span className="pid">{ele.id}</span>

          <h3 className="title">{ele.name}</h3>

          <img src={ele.image}  />

          {/* <h4 className="price">₹ {ele.price.toFixed(0)}</h4> */}
          <p>{ele.description}</p>

          {/* <p className="rating">⭐ {ele.rating.rate}</p> */}

          <button className="cart-btn" onClick={() => cart1(ele)}>
            Add Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;
