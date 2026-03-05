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
  const [datacart, setcart] = useState([]);
  const [price, setprice] = useState(0);

  // Fetch Products
  const fetch_data = async () => {
    const datas = await fetch("https://fakestoreapi.com/products");
    const final_data = await datas.json();
    setdata(final_data);
  };

  useEffect(() => {
    fetch_data();
  }, []);

  // Add to Cart
  const fetch_cart = (item) => {
    const add = [...datacart];
    item.qyt = 1;
    if (add.includes(item)) {
      alert("You Have alreday have product go and see in cart");
    } else {
      add.push(item);
      setcart(add);
      setprice(price + item.price);
    }
  };

  // Delete Item
  const deletes = (index) => {
    const add = [...datacart];
    const item = add[index];

    add.splice(index, 1);

    setcart(add);
    setprice(price - item.price);
  };

  // Increment Quantity
  const inc = (index) => {
    const add = [...datacart];
    const item = add[index];

    item.qyt = (item.qyt || 1) + 1;

    setcart(add);
    setprice(price + item.price);
  };

  // Decrement Quantity
  const dec = (index) => {
    const add = [...datacart];
    const item = add[index];

    if ((item.qyt || 1) > 1) {
      item.qyt -= 1;
      setprice(price - item.price);
      setcart(add);
    } else {
      alert("Quantity is 1. Use delete button");
    }
  };

  const clear = () => {
    setcart([]);
    setprice(0);
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
