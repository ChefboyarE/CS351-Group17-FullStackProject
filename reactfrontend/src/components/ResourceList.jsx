import React, {useState, useEffect} from "react";
import "./ResourceList.css";
import {useAuth} from './AuthProvider';
import {useNavigate} from 'react-router-dom';

function ResourceList() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [result, setResult] = useState("");
    const {logout} = useAuth();
    const navigate = useNavigate();

    const [resourcesList, setResourcesList] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);

    // Load database resources on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetch('http://127.0.0.1:5000/getResources');
                const data = await result.json();
                setResourcesList(data);
                setFilteredResources(data);
            } catch (err) {
                console.error("Error fetching resources:", err);
            }
        };

        fetchData();
    }, []);

    // Logout
    const handleLogoutClick = () => {
        logout();
        navigate('/login');
    };

    // ----- SEARCH -----
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        try {
            const formData = new URLSearchParams();
            formData.append("query", query);

            const res = await fetch("http://127.0.0.1:5000/search", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setResult(data.result);

            if (data.matches && data.matches.length > 0) {
                setFilteredResources(data.matches);
            } else {
                setFilteredResources([]);
            }

            setSuggestions([]);
        } catch (err) {
            console.error("Search error:", err);
        }
    };

    // ----- AUTOCOMPLETE -----
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value) {
            setSuggestions([]);
            setFilteredResources(resourcesList);
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

    return (
        <>
            {/* Top-right logout button */}
            <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
            </button>

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

                        <button className="search-btn" type="submit">
                            Search
                        </button>

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
                    {filteredResources.map((res, idx) => (
                        <li key={idx} className="resource-item">
                            <img src={res.img} alt="resource"/>
                            <div className="resource-details">
                                <h3>{res.title}</h3>
                                <p>{res.date} | {res.location}</p>
                                <p className="description">{res.description}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default ResourceList;
