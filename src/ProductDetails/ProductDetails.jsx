import React from "react";
import { useLocation } from "react-router-dom";
import "./ProductDetails.css";

const ProductDetails = () => {

  const location = useLocation();
  const product = location.state;

  if (!product) return <h2>No product selected</h2>;

  return (

    <div className="product-details">

      <div className="details-left">

        <img
          src={product.image || product.images}
          alt={product.name}
        />

      </div>

      <div className="details-right">

        <h2>{product.name}</h2>

        <h3>₹ {product.price}</h3>

        <p>{product.description}</p>

        <button className="buy-btn">
          Buy Now
        </button>

      </div>

    </div>

  );

};

export default ProductDetails;