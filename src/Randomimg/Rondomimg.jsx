import React, { useEffect, useState } from "react";
import "./Rodomimg.css";
const Rondomimg = () => {
  const [count, setcount] = useState(0);
  const next = () => {
    setcount(count + 1);
  };

  const previes = () => {
    if (count <= 1) alert("sorry ");
    else {
      setcount(count - 1);
    }
  };
  const [c_fetch, cdata] = useState([]);
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
  return (
    <div>
      <div className="r-container">
        {c_fetch.map((e) => (
          <div key={e.id} className="count-container">
            <span>{e.id}</span>
            <h2>{e.author}</h2>
            <img src={e.download_url} />
          </div>
        ))}
      </div>
      <div className="btn">
        <button className="decre" onClick={previes}>
          Previous
        </button>
        <button className="incre" onClick={next}>
          NextPage
        </button>
      </div>
    </div>
  );
};

export default Rondomimg;
