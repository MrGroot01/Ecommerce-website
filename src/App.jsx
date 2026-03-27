import React, { createContext, useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import { Route, Routes } from "react-router-dom";

import Home from "./Home/Home";
import About from "./About/About";
import Products from "./Products/Products";
import Contact from "./Contact/Contact";
import Addcart from "./AddCart/Addcart";
import Rondomimg from "./Randomimg/Rondomimg";
import PetCare from "./PetCare/PetCare";
import Pharmacy from "./Pharmacy/Pharmacy";
import Babycare from "./Babycare/Babycare";

import Login from "./Login/Login";
import Register from "./Register/Register";
import BuyNow from "./BuyNow/Buynow";
import ProductDetails from "./ProductDetails/ProductDetails";
import ProfileSidebar from "./ProfileSidebar/ProfileSidebar";
import ProfilePage from "./ProfilePage/ProfilePage";

/* CONTEXTS */

export const f_data = createContext();
export const cart_data = createContext();
export const add_cart = createContext();
export const price_data = createContext();
export const deleta_datas = createContext();
export const increment = createContext();
export const decrement = createContext();
export const cleardata = createContext();

export const searchfunc = createContext();
export const searchvalue = createContext();

const App = () => {

  const [data, setdata] = useState([]);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  /* ✅ USER STATE */

  const [user, setUser] = useState(null);

  // 🔥 IMPORTANT: sync user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  /* CART */

  const [datacart, setcart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [price, setprice] = useState(0);
  const [search, setSearch] = useState("");

  const searfun = (value) => setSearch(value);

  /* FETCH PRODUCTS */

  useEffect(() => {
    fetch("https://ecommerceapidata.onrender.com/api/")
      .then(res => res.json())
      .then(data => setdata(data));
  }, []);

  /* SAVE CART */

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(datacart));
  }, [datacart]);

  /* TOTAL PRICE */

  useEffect(() => {
    const total = datacart.reduce(
      (sum, item) => sum + item.price * (item.qyt || 1),
      0
    );
    setprice(total);
  }, [datacart]);

  /* ✅ ADD TO CART (FINAL FIX) */

  const fetch_cart = (item) => {

    // 🔥 DOUBLE CHECK (important)
    const currentUser = user || JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("Please login to add items to cart");
      setShowLogin(true);
      return;
    }

    const add = [...datacart];
    const exists = add.some((i) => i.id === item.id);

    if (exists) {
      alert("Product already added to cart");
    } else {
      add.push({ ...item, qyt: 1 });
      setcart(add);
    }
  };

  /* DELETE */

  const deletes = (index) => {
    const add = [...datacart];
    add.splice(index, 1);
    setcart(add);
  };

  /* INC */

  const inc = (index) => {
    const add = [...datacart];
    add[index].qyt += 1;
    setcart(add);
  };

  /* DEC */

  const dec = (index) => {
    const add = [...datacart];

    if (add[index].qyt > 1) {
      add[index].qyt -= 1;
      setcart(add);
    } else {
      alert("Quantity is 1");
    }
  };

  /* CLEAR */

  const clear = () => {
    setcart([]);
    setprice(0);
    localStorage.removeItem("cart");
  };

  return (
    <div>

      <searchvalue.Provider value={search}>
        <searchfunc.Provider value={searfun}>
          <cleardata.Provider value={clear}>
            <decrement.Provider value={dec}>
              <increment.Provider value={inc}>
                <deleta_datas.Provider value={deletes}>
                  <price_data.Provider value={price}>
                    <add_cart.Provider value={datacart}>
                      <f_data.Provider value={data}>
                        <cart_data.Provider value={fetch_cart}>

                          <Navbar
                            setShowLogin={setShowLogin}
                            user={user}
                            setUser={setUser}
                          />

                          {showLogin && (
                            <Login
                              setShowLogin={setShowLogin}
                              setShowRegister={setShowRegister}
                              setUser={setUser}
                            />
                          )}

                          {showRegister && (
                            <Register
                              setShowRegister={setShowRegister}
                              setShowLogin={setShowLogin}
                            />
                          )}

                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/Products" element={<Products />} />
                            <Route path="/Addcart" element={<Addcart />} />
                          </Routes>

                        </cart_data.Provider>
                      </f_data.Provider>
                    </add_cart.Provider>
                  </price_data.Provider>
                </deleta_datas.Provider>
              </increment.Provider>
            </decrement.Provider>
          </cleardata.Provider>
        </searchfunc.Provider>
      </searchvalue.Provider>

    </div>
  );
};

export default App;