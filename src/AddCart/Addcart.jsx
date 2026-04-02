import React, { useContext, useState, useEffect } from "react";
import "./Addcart.css";
import Checkout from "../Checkout/Checkout";

import {
  add_cart,
  cleardata,
  decrement,
  deleta_datas,
  increment,
  price_data,
  cart_data,
  user_data,
  login_control
} from "../App";

const API_MAP = {
  baby: "https://babycare-tawz.onrender.com/api/",
  pharmacy: "https://pharmacyapi-1.onrender.com/api/",
  pet: "https://petcare-byc5.onrender.com/api/",
  ecommerce: "https://ecommerceapidata.onrender.com/api/",
};

const Addcart = () => {

  const add1 = useContext(add_cart);
  const price1 = useContext(price_data);
  const delete1 = useContext(deleta_datas);
  const incr1 = useContext(increment);
  const decr1 = useContext(decrement);
  const clear1 = useContext(cleardata);
  const addCart = useContext(cart_data);

  const user = useContext(user_data);
  const setShowLogin = useContext(login_control);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const detectCategory = (item) => {
    const name = (item.name || "").toLowerCase();
    if (name.includes("pampers") || name.includes("huggies")) return "baby";
    if (name.includes("dog") || name.includes("cat")) return "pet";
    if (name.includes("tablet") || name.includes("medicine")) return "pharmacy";
    return "ecommerce";
  };

  const getCategory = () => {
    if (add1.length === 0) return "ecommerce";
    return add1[0].category || detectCategory(add1[0]);
  };

  useEffect(() => {
    if (add1.length === 0) return;

    const category = getCategory();
    const apiUrl = API_MAP[category];

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const clean = data.map(item => ({
          id: (item.id || item._id || item.name).toString().toLowerCase(),
          name: item.name || item.title,
          price: item.price || item.cost,
          image: item.image || item.images,
          category: category
        }));

        const filtered = clean.filter(
          p => !add1.some(c => c.id === p.id)
        );

        setRelatedProducts(filtered.slice(0, 6));
      });
  }, [add1]);

  const handleCheckout = () => {
    if (!user || Object.keys(user).length === 0) {
      alert("Please login to continue");
      setShowLogin(true);
      return;
    }
    setShowCheckout(true);
  };

  const itemCount = add1.reduce((s, i) => s + (i.qyt || 1), 0);

  if (showCheckout) {
    return (
      <Checkout
        cartItems={add1}
        subtotal={price1 || 0}
        delivery={price1 >= 499 ? 0 : 49}
        discount={0}
        total={price1 >= 499 ? price1 : (price1 || 0) + 49}
        onBack={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-inner">

        <div className="cart-topbar">
          <h1 className="cart-title">My Cart</h1>
          <span className="cart-count">{itemCount} items</span>
        </div>

        <div className="cart-layout">

          {/* LEFT */}
          <div>
            <div className="cart-items-panel">
              {add1.map((item, index) => {
                const qty = item.qyt || 1;

                return (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} className="cart-img" />

                    <div className="cart-info">
                      <h3>{item.name}</h3>
                      <p>₹{item.price} per unit</p>

                      <div className="qty-row">
                        <button onClick={() => decr1(index)}>-</button>
                        <span>{qty}</span>
                        <button onClick={() => incr1(index)}>+</button>
                      </div>

                      <span className="remove-btn" onClick={() => delete1(index)}>
                        Remove
                      </span>
                    </div>

                    <div className="cart-price">
                      ₹{item.price * qty}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RELATED */}
            <div className="related-section">
              <h3 className="related-title">YOU MIGHT ALSO LIKE</h3>

              <div className="related-grid">
                {relatedProducts.map((p) => (
                  <div className="related-card" key={p.id}>
                    <img src={p.image} alt={p.name} />

                    <div className="related-body">
                      <p>{p.name}</p>
                      <span>₹{p.price}</span>

                      <button onClick={() => addCart(p)}>+ Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="cart-summary">
            <h4>Order Summary</h4>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{price1}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>{price1 >= 499 ? "FREE" : "₹49"}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <span>₹{price1 >= 499 ? price1 : price1 + 49}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout →
            </button>

            <button className="clear-btn" onClick={clear1}>
              Clear Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Addcart;