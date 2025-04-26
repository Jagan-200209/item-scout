import React, { useState, CSSProperties, useEffect } from "react";
import Itemcard from "../components/ItemCard";
import Navbar from "../components/Navbar";
import axios from "axios";
import { api } from "../config";
import HashLoader from "react-spinners/HashLoader";
import AOS from "aos";
import "aos/dist/aos.css";
import SearchIcon from "@mui/icons-material/Search";

function Find() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'lost', or 'found'

  useEffect(() => {
    AOS.init({ duration: 750 });
  }, []);

  const override = {
    display: "block",
    borderColor: "#fdf004",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  };

  useEffect(() => {
    axios
      .get(`${api}/item`)
      .then((res) => {
        setItems(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Filter and search items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || item.itemType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main id="findpage">
      <Navbar />
      <section>
        <h1 className="lfh1">Lost and Found Items</h1>
        
        <div className="search-filter-container">
          <div className="search-container">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-container">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All Items
            </button>
            <button
              className={filter === "lost" ? "active" : ""}
              onClick={() => setFilter("lost")}
            >
              Lost Items
            </button>
            <button
              className={filter === "found" ? "active" : ""}
              onClick={() => setFilter("found")}
            >
              Found Items
            </button>
          </div>
        </div>

        <div className="item-container">
          <HashLoader
            color="#fdf004"
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          {filteredItems.reverse().map((item, index) => (
            <Itemcard
              key={index}
              id={item._id}
              title={item.title}
              description={item.description}
              image={item.image}
              itemType={item.itemType}
            />
          ))}
          <div className="extraItem"></div>
          <div className="extraItem"></div>
          <div className="extraItem"></div>
        </div>
      </section>
    </main>
  );
}

export default Find;
