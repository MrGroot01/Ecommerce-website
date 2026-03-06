import React, { createContext, useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import { Route, Routes } from "react-router-dom";

import Home from "./Home/Home";
import About from "./About/About";
import Products from "./Products/Products";
import Contact from "./Contact/Contact";
import Addcart from "./AddCart/Addcart";
import Rondomimg from "./Randomimg/Rondomimg";

export const f_data = createContext();
export const cart_data = createContext();
export const add_cart = createContext();
export const price_data = createContext();
export const deleta_datas = createContext();
export const increment = createContext();
export const decrement = createContext();
export const cleardata = createContext();

const App = () => {

  const [data, setdata] = useState([]);

  /* CART STATE (LOAD FROM LOCAL STORAGE) */
  const [datacart, setcart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [price, setprice] = useState(0);


  /* FETCH PRODUCTS */
  const fetch_data = async () => {
    const datas = await fetch("https://ecommerceapidata.onrender.com/api/");
    const final_data = await datas.json();
    setdata(final_data);
  };

  useEffect(() => {
    fetch_data();
  }, []);


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(datacart));
  }, [datacart]);


  useEffect(() => {
    const total = datacart.reduce(
      (sum, item) => sum + item.price * (item.qyt || 1),
      0
    );
    setprice(total);
  }, [datacart]);


  /* ADD TO CART */
  const fetch_cart = (item) => {
    const add = [...datacart];

    const exists = add.some((i) => i.id === item.id);

    if (exists) {
      alert("Product already added to cart");
    } else {
      add.push({ ...item, qyt: 1 });
      setcart(add);
    }
  };


  /* DELETE ITEM */
  const deletes = (index) => {
    const add = [...datacart];
    add.splice(index, 1);
    setcart(add);
  };


  /* INCREMENT */
  const inc = (index) => {
    const add = [...datacart];
    add[index].qyt += 1;
    setcart(add);
  };


  /* DECREMENT */
  const dec = (index) => {
    const add = [...datacart];

    if (add[index].qyt > 1) {
      add[index].qyt -= 1;
      setcart(add);
    } else {
      alert("Quantity is 1. Use delete button");
    }
  };


  /* CLEAR CART */
  const clear = () => {
    setcart([]);
    setprice(0);
    localStorage.removeItem("cart");
  };


  return (
    <div>

      <cleardata.Provider value={clear}>
        <decrement.Provider value={dec}>
          <increment.Provider value={inc}>
            <deleta_datas.Provider value={deletes}>
              <price_data.Provider value={price}>
                <add_cart.Provider value={datacart}>
                  <f_data.Provider value={data}>
                    <cart_data.Provider value={fetch_cart}>

                      <Navbar />

                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/About" element={<About />} />
                        <Route path="/Products" element={<Products />} />
                        <Route path="/Contact" element={<Contact />} />
                        <Route path="/Addcart" element={<Addcart />} />
                        <Route path="/Rondomimg" element={<Rondomimg />} />
                      </Routes>

                    </cart_data.Provider>
                  </f_data.Provider>
                </add_cart.Provider>
              </price_data.Provider>
            </deleta_datas.Provider>
          </increment.Provider>
        </decrement.Provider>
      </cleardata.Provider>

    </div>
  );
};

export default App;