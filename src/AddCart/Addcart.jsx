import React, { useContext } from "react";
import "./Addcart.css";
import {
  add_cart,
  cleardata,
  decrement,
  deleta_datas,
  increment,
  price_data,
} from "../App";

const Addcart = () => {

  const add1 = useContext(add_cart);
  const price1 = useContext(price_data);
  const delete1 = useContext(deleta_datas);
  const incr1 = useContext(increment);
  const decr1 = useContext(decrement);
  const clear1 = useContext(cleardata);

  return (
    <div className="add-container">

      <div className="table-wrapper">

        <table className="table">

          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {add1.map((i, index) => (

              <tr key={index}>

                <td>{index + 1}</td>

                {/* Supports both title and name */}
                <td>{i.title || i.name}</td>

                <td>₹{i.price}</td>

                <td>{i.qyt || 1}</td>

                <td>
                  <img
                    src={i.image || i.images}
                    alt={i.title || i.name}
                    className="cart-img"
                  />
                </td>

                <td>

                  <button
                    className="low"
                    onClick={() => decr1(index)}
                  >
                    -
                  </button>

                  <button
                    className="del"
                    onClick={() => delete1(index)}
                  >
                    delete
                  </button>

                  <button
                    className="high"
                    onClick={() => incr1(index)}
                  >
                    +
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <h2>Total Price: ₹{price1.toFixed(0)}</h2>

      <button className="clear" onClick={clear1}>
        Clear Cart
      </button>

    </div>
  );
};

export default Addcart;