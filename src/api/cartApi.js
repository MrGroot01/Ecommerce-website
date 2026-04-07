const API_BASE = "http://127.0.0.1:8000/api/cart/";

// 🔥 ADD ITEM
export const addItem = async (userId, product) => {
  const res = await fetch(`${API_BASE}add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, product }),
  });

  return res.json();
};

// 🔥 GET CART
export const getCart = async (userId) => {
  const res = await fetch(`${API_BASE}${userId}/`);
  return res.json();
};

// 🔥 DELETE ITEM
export const deleteItem = async (id) => {
  await fetch(`${API_BASE}delete/${id}/`, {
    method: "DELETE",
  });
};