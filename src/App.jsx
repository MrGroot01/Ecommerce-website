import React, { createContext, useEffect, useState } from "react";
import Navbar from "./Navbar/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./Home/Home";
import About from './About/About';
import Products from './Products/Products';
import Contact from './Contact/Contact';
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
import Chatbot from "./Chatbot/Chatbot";
import Checkout from "./Checkout/Checkout";
import NotFound from "./NotFound/NotFound";
import Masala from "./Masala/Masala";
import Electric from "./Electric/Electric";
import Cold from "./Cold/Cold";
import Shoes from "./Shoes/Shoes";
import OrderHistory from "./pages/Orderhistory";
import Wishlist from "./pages/Wishlist";
import Rewards from "./pages/Rewards";
import Returns from "./pages/Returns";

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
export const user_data = createContext();
export const login_control = createContext();

const App = () => {
  const [data, setdata] = useState([]);

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  /* ✅ USER STATE (ONLY THIS IS NEEDED) */
  const [user, setUser] = useState(null);

  // 🔥 Sync user from localStorage on load
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
      .then((res) => res.json())
      .then((data) => setdata(data));
  }, []);

  /* SAVE CART */

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(datacart));
  }, [datacart]);

  /* TOTAL PRICE */

  useEffect(() => {
    const total = datacart.reduce(
      (sum, item) => sum + item.price * (item.qyt || 1),
      0,
    );
    setprice(total);
  }, [datacart]);

  /* ✅ ADD TO CART (FINAL FIX) */

  // 🔥 AUTO CATEGORY DETECT
  // 🔥 UNIQUE ID (FINAL FIX)
const getUniqueId = (item) => {
  return (item.id || item._id || item.name)
    .toString()
    .trim()
    .toLowerCase();
};

// 🔥 AUTO CATEGORY
const detectCategory = (item) => {
  const name = (item.name || item.title || "").toLowerCase();

  if (name.includes("pampers") || name.includes("huggies")) return "baby";
  if (name.includes("dog") || name.includes("cat")) return "pet";
  if (name.includes("tablet") || name.includes("medicine")) return "pharmacy";

  return "ecommerce";
};

// ✅ FINAL ADD TO CART (FIXED)
const fetch_cart = (item) => {

  if (!user) {
    alert("Please login to add items to cart");
    setShowLogin(true);
    return;
  }

  const updatedCart = [...datacart];

  const itemId = getUniqueId(item);

  const exists = updatedCart.some(
    (i) => getUniqueId(i) === itemId
  );

  if (exists) {
    // ❌ STOP DUPLICATE
    alert("Already in cart");
    return;
  }

  // ✅ ADD ONLY ONCE
  updatedCart.push({
    ...item,
    id: itemId, // 🔥 FORCE SAME ID
    qyt: 1,
    category: item.category || detectCategory(item),
  });

  setcart(updatedCart);
};

  /* DELETE */

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
      alert("Quantity is 1");
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
      <GoogleOAuthProvider clientId="325836534812-bb0m0j91fgghrei7shrhpi54uuspinei.apps.googleusercontent.com">
      <searchvalue.Provider value={search}>
        <searchfunc.Provider value={searfun}>
          <cleardata.Provider value={clear}>
            <decrement.Provider value={dec}>
              <increment.Provider value={inc}>
                <deleta_datas.Provider value={deletes}>
                  <price_data.Provider value={price}>
                    <add_cart.Provider value={datacart}>
                      <f_data.Provider value={data}>
                        <user_data.Provider value={user}>
                          <login_control.Provider value={setShowLogin}>
                        <cart_data.Provider value={fetch_cart}>
                          {/* NAVBAR */}
                          <Navbar
                            setShowLogin={setShowLogin}
                            user={user}
                            setUser={setUser}
                          />

                          {/* LOGIN */}
                          {showLogin && (
                            <Login
                              setShowLogin={setShowLogin}
                              setShowRegister={setShowRegister}
                              setUser={setUser}
                            />
                          )}

                          {/* REGISTER */}
                          {showRegister && (
                            <Register
                              setShowRegister={setShowRegister}
                              setShowLogin={setShowLogin}
                            />
                          )}

                          {/* ROUTES */}
                          <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/About" element={<About />} />
                            <Route path="/Products" element={<Products />} />
                            <Route path="/Contact" element={<Contact />} />
                            <Route path="/help" element={<Navigate to="/contact" replace />}/>
                            <Route path="/Addcart" element={<Addcart />} />
                            <Route path="/Rondomimg" element={<Rondomimg />} />
                            <Route path="/PetCare" element={<PetCare />} />
                            <Route path="/Pharmacy" element={<Pharmacy />} />
                            <Route path="/Babycare" element={<Babycare />} />
                            <Route path="/buy" element={<BuyNow />} />
                            <Route path="*" element={<NotFound/>} />
                            <Route path="/masala" element={<Masala/>} />
                            <Route path="/electronics" element={<Electric/>} />
                            <Route path="/cold" element={<Cold/>} />
                            <Route path="/shoes" element={<Shoes/>}/>
                            <Route path="/orders" element={<OrderHistory/>}/>
                            <Route path="/wishlist" element={<Wishlist/>} />
                            <Route path="/rewards" element={<Rewards/>} />
                            <Route path="/notifications" element={<Notification/>} />
                            <Route path="/returns" element={<Returns/>} />
                            <Route path="/product-details" element={<ProductDetails />} />
                            <Route path="/ProfileSidebar" element={<ProfileSidebar />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/Checkout" element={<Checkout />} />
                          </Routes>
                          <Chatbot />
                        </cart_data.Provider>
                        </login_control.Provider>
                        </user_data.Provider>
                      </f_data.Provider>
                    </add_cart.Provider>
                  </price_data.Provider>
                </deleta_datas.Provider>
              </increment.Provider>
            </decrement.Provider>
          </cleardata.Provider>
        </searchfunc.Provider>
      </searchvalue.Provider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
