import React, { useEffect, useState, useContext } from "react";
import "./PetCare.css";
import { cart_data, searchvalue } from "../App";

const PetCare = () => {

  const [products, setProducts] = useState([]);
  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  const fetchProducts = async () => {
    const res = await fetch("https://petcare-byc5.onrender.com/api/");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pros-container">

      {filteredProducts.map((el) => (

        <div className="ps_container" key={el.id}>

          <span className="pids">{el.id}</span>

          <h3 className="titles">{el.name}</h3>

          <img src={el.images} alt={el.name} />

          <h4 className="prices">₹ {el.price.toFixed(0)}</h4>

          <p className="ratings">⭐ {Number(el.rating).toFixed(1)}</p>

          <p>{el.description}</p>

          <button
            className="cart-btns"
            onClick={() =>
              cart1({
                ...el,
                id: "pet-" + el.id,
                title: el.name,
                image: el.images
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

export default PetCare;