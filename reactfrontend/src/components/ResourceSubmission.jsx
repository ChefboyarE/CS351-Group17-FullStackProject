import {useState} from "react";
import "./ResourceSubmission.css";

function Submission({onLogin}) {
    // entries: title, date, location, description
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // call Flask
        try {
            const res = await fetch("http://127.0.0.1:5000/resourceSubmission", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, date, location, description}),
            });

            const data = await res.json();
            if (data.success) {
                alert("Event submitted!");
            } else alert(data.message);

        } catch (err) {
            console.error("Resource submission error: ", err);
            alert("Error submitting event");
            // alert(err);
        }
    };

    return(
        <div className="resource-container">
            <a href = "/resources" className = "submit-btn">{"\u2190"}</a>
            <h1>Resource Submission</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type = "title"
                    placeholder = "Title"
                    value = {title}
                    onChange = {(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type = "date"
                    placeholder = "date"
                    value = {date}
                    onChange = {(e) => setDate(e.target.value)}
                    max = "9999-12-31"
                    required
                />
                <input
                    type = "location"
                    placeholder = "location"
                    value = {location}
                    onChange = {(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type = "description"
                    placeholder = "description"
                    value = {description}
                    onChange = {(e) => setDescription(e.target.value)}
                    required
                />
                <button type = "submit">Submit Event</button>
            </form>
        </div>
    )
}

export default Submission;