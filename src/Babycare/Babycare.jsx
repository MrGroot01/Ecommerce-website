
import React, { useEffect, useState, useContext } from "react";
import "./Babycare.css";
import { cart_data, searchvalue } from "../App";

const Babycare = () => {

  const [products, setProducts] = useState([]);
  const cart1 = useContext(cart_data);
  const search = useContext(searchvalue);

  const fetchProducts = async () => {
    try{
      const res = await fetch("https://babycare-tawz.onrender.com/api/");
      const data = await res.json();
      setProducts(data);
    }catch(error){
      console.log("API Error:", error);
    }
  };

  useEffect(()=>{
    fetchProducts();
  },[]);

  /* SEARCH FILTER */

  const filteredProducts = products.filter((item)=>
    item.name.toLowerCase().includes((search || "").toLowerCase())
  );

  return (
    <div className="baby-container">

      {filteredProducts.map((el)=>(
        
        <div className="baby-card" key={el.id}>

          <span className="baby-id">{el.id}</span>

          <h3 className="baby-title">{el.name}</h3>

          <img src={el.image} alt={el.name} />

          <h4 className="baby-price">₹ {el.price}</h4>

          <p className="baby-size">Size: {el.size}</p>

          <p className="baby-desc">{el.description}</p>

          <p className="baby-available">Available: {el.available}</p>

          <button
            className="baby-btn"
            onClick={()=>cart1({
              ...el,
              id:"baby-"+el.id,
              title:el.name,
              image:el.image
            })}
          >
            Add Cart
          </button>

        </div>

      ))}

    </div>
  );
};

export default Babycare;
