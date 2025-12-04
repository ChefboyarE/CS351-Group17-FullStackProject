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
    const [filterType, setFilterType] = useState("");
    const [hidePast, setHidePast] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        date: "",
        location: "",
        description: "",
        today: "",
    });

    const getLocalToday = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
};
    const suggestionBox = document.querySelector('.suggestions')

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

    // Bloom Filter
    const handleFilterChange = async (e) => {
        const type = e.target.value;
        setFilterType(type);

        if (type === "") {
            setFilteredResources(resourcesList);
            setResult("");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:5000/filter", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({filterType: type}),
            });

            const data = await res.json();
            setFilteredResources(data.matches);
            setResult(`Filtering by ${type}`);
        } catch (err) {
            console.error("Filter error:", err);
        }
    };

    // SEARCH
    const handleSearch = async (e) => {
        e.preventDefault();
        suggestionBox.classList.remove("is-active")
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

    // AUTOCOMPLETE
    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value) {
            setSuggestions([]);
            setFilteredResources(resourcesList);
            suggestionBox.classList.remove('is-active');
            return;
        }

        try {
            const res = await fetch(
                `http://127.0.0.1:5000/suggest?query=${encodeURIComponent(value)}`
            );
            const data = await res.json();
            setSuggestions(data);
            suggestionBox.classList.add('is-active');
        } catch (err) {
            console.error("Autocomplete error:", err);
        }
    };

    const handleSuggestionClick = (s) => {
        setQuery(s);
        setSuggestions([]);
        suggestionBox.classList.remove('is-active')
    };

    // Delete an event
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/events/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                alert(data.message || "Error deleting event");
                return;
            }

            // Remove from local state
            const updated = resourcesList.filter((e) => e.id !== id);
            setResourcesList(updated);
            setFilteredResources(updated);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting event");
        }
    };

    // Start editing
    const startEdit = (event) => {
        setEditingEvent(event);
        setEditForm({
            title: event.title,
            date: event.date,
            location: event.location,
            description: event.description,
            today: getLocalToday(),
        });
    };

    // Save edit
    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editingEvent) return;

        try {
            const res = await fetch(
                `http://127.0.0.1:5000/events/${editingEvent.id}`,
                {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify(editForm),
                }
            );

            const data = await res.json();
            if (!res.ok || !data.success) {
                alert(data.message || "Error updating event");
                return;
            }

            // Update local arrays
            const updateInArray = (arr) =>
                arr.map((ev) =>
                    ev.id === editingEvent.id
                        ? {...ev, ...editForm}
                        : ev
                );

            const updatedAll = updateInArray(resourcesList);
            const updatedFiltered = updateInArray(filteredResources);

            setResourcesList(updatedAll);
            setFilteredResources(updatedFiltered);
            setEditingEvent(null);
        } catch (err) {
            console.error("Edit save error:", err);
            alert("Error updating event");
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingEvent(null);
    };

    return (
        <div className="page-wrapper">
            <button className="logout-btn" onClick={handleLogoutClick}>
                Logout
            </button>

            <div className="resource-container">
                <a href="/resourceSubmission" className="submit-btn">+</a>
                <h1>UIC Resources</h1>

                <select className="filter-dropdown" value={filterType} onChange={handleFilterChange}>
                    <option value="">Filter by...</option>
                    <option value="title">Title</option>
                    <option value="location">Location</option>
                    <option value="date">Date</option>
                </select>

                <div className="toggle-container">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={hidePast}
                            onChange={() => setHidePast(!hidePast)}
                        />
                        Hide past events
                    </label>
                </div>

                <form onSubmit={handleSearch}>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search resources"
                            value={query}
                            onChange={handleInputChange}
                        />

                        <div className="suggestions">
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

                        <button className="search-btn" type="submit">
                            Search
                        </button>
                    </div>
                </form>

                {result && <p id="result">{result}</p>}

                <ul className="resource-list">
                    {filteredResources
                        .filter((res) => !(hidePast && res.isPast))
                        .map((res, idx) => (
                            <li
                                key={res.id || idx}
                                className={`resource-item ${res.isPast ? "past-event" : ""}`}
                            >
                                <img src={res.img} alt="resource"/>
                                <div className="resource-details">
                                    <h3>{res.title}</h3>
                                    <p>
                                        {res.date} | {res.location}
                                    </p>
                                    <p className="description">{res.description}</p>

                                    <div className="event-actions">
                                        <button
                                            type="button"
                                            className="edit-btn"
                                            onClick={() => startEdit(res)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
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
                {editingEvent && (
                    <div className="edit-modal">
                        <h2>Edit Event</h2>
                        <form onSubmit={handleEditSave} className="edit-form">
                            <input
                                type="text"
                                placeholder="Title"
                                value={editForm.title}
                                onChange={(e) =>
                                    setEditForm({...editForm, title: e.target.value})
                                }
                                required
                            />
                            <input
                                type="date"
                                value={editForm.date}
                                onChange={(e) =>
                                    setEditForm({...editForm, date: e.target.value})
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                value={editForm.location}
                                onChange={(e) =>
                                    setEditForm({...editForm, location: e.target.value})
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={editForm.description}
                                onChange={(e) =>
                                    setEditForm({...editForm, description: e.target.value})
                                }
                                required
                            />

                            <div className="edit-actions">
                                <button type="submit" className="save-btn">Save</button>
                                <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResourceList;
