import React, { useEffect, useState, useContext } from "react";
import "./Pharmacy.css";
import { cart_data, searchvalue } from "../App";

const Pharmacy = () => {
  const [products, setProducts] = useState([]);
  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  const fetchProducts = async () => {
    const res = await fetch("https://pharmacyapi-1.onrender.com/api/");
    const data = await res.json();

    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="ph-container">
      {filteredProducts.map((el, index) => (
        <div className="ph-card" key={index}>
          <span className="ph-id">{index + 1}</span>

          <h3 className="ph-title">{el.name}</h3>

          <img src={el.image} alt={el.name} />

          <h4 className="ph-price">₹ {el.price}</h4>

          <p className="ph-desc">{el.description}</p>

          <p className="ph-manufacturer">Manufacturer: {el.manufacturer}</p>

          <p className="ph-stock">Stock: {el.stock_quantity}</p>

          <button
            className="ph-btn"
            onClick={() =>
              cart1({
                ...el,
                id: "ph-" + index,
                title: el.name,
                image: el.image,
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

export default Pharmacy;
