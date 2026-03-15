import React from "react";
import { useLocation } from "react-router-dom";

const Buy = () => {

  const location = useLocation();
  const product = location.state;

  return (

    <div style={{padding:"40px", textAlign:"center"}}>

      <h2>Buy Product</h2>

      {product && (

        <div>

          <h3>{product.name}</h3>

          <img
            src={product.image}
            alt={product.name}
            style={{width:"200px"}}
          />

          <h3>₹ {product.price}</h3>

          <p>{product.description}</p>

          <button style={{
            padding:"12px 25px",
            background:"green",
            color:"white",
            border:"none",
            borderRadius:"6px"
          }}>
            Proceed to Payment
          </button>

        </div>

      )}

    </div>

  );

};

export default Buy;