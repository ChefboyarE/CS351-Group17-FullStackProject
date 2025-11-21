import React, { useState, useEffect } from "react";
import "./ResourceList.css";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";

function ResourceList() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [result, setResult] = useState("");

  const [resourcesList, setResourcesList] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);

  // Load initial resources
  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch("http://127.0.0.1:5000/getResources");
        const data = await res.json();
        setResourcesList(data);
        setFilteredResources(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      }
    }

    fetchResources();
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const formData = new URLSearchParams();
      formData.append("query", query);

      const res = await fetch("http://127.0.0.1:5000/search", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data.result || "");

      if (data.matches?.length > 0) {
        setFilteredResources(data.matches);
      } else {
        setFilteredResources([]);
      }

      setSuggestions([]);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  // Input change → suggestions
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setFilteredResources(resourcesList);
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:5000/suggest?query=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setSuggestions([]);
  };

  // DELETE resource
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this event?");
    if (!ok) return;

    try {
      const res = await fetch(`http://127.0.0.1:5000/deleteResource/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setFilteredResources(filteredResources.filter((r) => r.id !== id));
        setResourcesList(resourcesList.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="page-wrapper">

      {/* Header */}
      <header className="page-header">
        <h1>UIC Resources</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main content box */}
      <div className="resource-container">

        {/* Create new event button */}
        <a href="/resourceSubmission" className="submit-btn">
          +
        </a>

        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search resources"
              value={query}
              onChange={handleInputChange}
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
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
            )}
          </div>
        </form>

        {result && <p id="result">{result}</p>}

        {/* Scrollable List */}
        <div className="resource-scroll">
          <ul className="resource-list">
            {filteredResources.map((res) => (
              <li key={res.id} className="resource-item">
                <img src={res.img} alt="resource" />

                <div className="resource-details">
                  <h3>{res.title}</h3>
                  <p>{res.date} | {res.location}</p>
                  <p className="description">{res.description}</p>

                  {/* Edit + Delete buttons */}
                  <div className="resource-actions">
                    <button
                      className="edit-btn"
                      onClick={() =>
                        navigate(`/resourceSubmission?id=${res.id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(res.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default ResourceList;
