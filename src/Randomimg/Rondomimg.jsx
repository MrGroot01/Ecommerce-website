import React, { useContext, useEffect, useState } from "react";
import "./Rodomimg.css";
import { searchvalue } from "../App";

const Rondomimg = () => {
  const search = useContext(searchvalue);

  const [count, setcount] = useState(1);
  const [c_fetch, cdata] = useState([]);

  const next = () => {
    setcount(count + 1);
  };

  const previes = () => {
    if (count <= 1) {
      alert("No previous page");
    } else {
      setcount(count - 1);
    }
  };

  const fetch_cdatd = async () => {
    const c_data = await fetch(
      `https://picsum.photos/v2/list?page=${count}&limit=10`,
    );

    const c_final = await c_data.json();

    cdata(c_final);
  };

  useEffect(() => {
    fetch_cdatd();
  }, [count]);

  /* SEARCH FILTER */

  const filteredProducts = c_fetch.filter((item) =>
    item.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="r-container">
        {filteredProducts.map((e) => (
          <div key={e.id} className="count-container">
            <span>{e.id}</span>

            <h2>{e.author}</h2>

            <img src={e.download_url} alt={e.author} />
          </div>
        ))}
      </div>

      <div className="btn">
        <button className="decre" onClick={previes}>
          Previous
        </button>

        <button className="incre" onClick={next}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Rondomimg;
