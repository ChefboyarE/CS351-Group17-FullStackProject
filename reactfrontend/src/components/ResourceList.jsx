import React, { useState } from "react";
import "./ResourceList.css";

function ResourceList() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState("");

  const resources = [
    {
      img: "https://shop.undergroundshirts.com/cdn/shop/files/UIC-1021_1001072_18500_Navy_2.jpg?v=1751390090",
      title: "Library Services",
      date: "Oct 25, 2025",
      location: "UIC Library",
      description: "Access books, journals, and study spaces."
    },
    {
      img: "https://shop.undergroundshirts.com/cdn/shop/files/UIC-1021_1001072_18500_Navy_2.jpg?v=1751390090",
      title: "Student Counseling",
      date: "Oct 26, 2025",
      location: "SSB 1200",
      description: "Free mental health support for students."
    },
    {
      img: "https://shop.undergroundshirts.com/cdn/shop/files/UIC-1021_1001072_18500_Navy_2.jpg?v=1751390090",
      title: "Career Center",
      date: "Oct 27, 2025",
      location: "SCE 200",
      description: "Resume workshops and job fairs."
    }
  ];

  // Handle form submit to search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const formData = new URLSearchParams();
      formData.append("query", query);

      const res = await fetch("http://127.0.0.1:5000/api/search", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.message); // show the search result
      setSuggestions([]);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Handle typing in search input for autocomplete
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/suggest?query=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data); // show autocomplete suggestions
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  // When clicking on a suggestion
  const handleSuggestionClick = (s) => {
    setQuery(s);
    setSuggestions([]);
  };

  return (
    <div className="resource-container">
      <a href="/resourceSubmission" className="submit-btn">+</a>
      <h1>UIC Resources</h1>

      <form onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search resources"
            value={query}
            onChange={handleInputChange}
          />
          <span className="filter-btn">Filter</span>
          <div id="suggestions">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </form>

      {result && <p id="result">{result}</p>}

      <ul className="resource-list">
        {resources.map((res, idx) => (
          <li key={idx} className="resource-item">
            <img src={res.img} alt="UIC logo" />
            <div className="resource-details">
              <h3>{res.title}</h3>
              <p>{res.date} | {res.location}</p>
              <p className="description">{res.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceList;
