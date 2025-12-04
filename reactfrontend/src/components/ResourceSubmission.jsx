import {useEffect, useState} from "react";
import "./ResourceSubmission.css";
import {useNavigate} from "react-router-dom";

// Default image used when user does NOT upload one
const DEFAULT_IMAGE =
    "https://shop.undergroundshirts.com/cdn/shop/files/UIC-1021_1001072_18500_Navy_2.jpg?v=1751390090";
// Helper so user cannot choose date that has passed already
const getLocalToday = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
};

function Submission({onLogin}) {
    // entries: title, date, location, description
    const [img, setImage] = useState(DEFAULT_IMAGE);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [today, setToday] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setToday(getLocalToday());
    }, []);

    // Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreview(reader.result);
            setImage(reader.result);
        };

        reader.readAsDataURL(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // If user never uploads an image, img will just be defualt UIC logo
        const imageToSend = preview ? img : DEFAULT_IMAGE;
        // Users local date format
        const userToday = today;

        // call Flask
        try {
            if (title.length > 85) {
                alert("please limit title to 85 characters!")
                return
            }

            if (description.length > 2500) {
                alert("please limit description to 2500 characters!")
                return
            }

            const res = await fetch("http://127.0.0.1:5000/resourceSubmission", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({img: imageToSend, title, date, location, description, today: userToday}),
            });

            const data = await res.json();
            if (data.success) {
                alert("Event submitted!");
                navigate("/resources");
            } else alert(data.message);

        } catch (err) {
            console.error("Resource submission error: ", err);
            alert("Error submitting event");
            // alert(err);
        }
    };

    return (
        <div className="resource-submission-container">
            <a href="/resources" className="submit-btn">{"\u2190"}</a>
            <h1>Resource Submission</h1>
            <form onSubmit={handleSubmit}>
                <input
                    id = "title-input"
                    className = "title-field"
                    type="title"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={85}
                    required
                />
                <div className="date-location-container">
                    <input
                        id = "date-input"
                        className = "date-field"
                        type="date"
                        placeholder="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={today}
                        max="9999-12-31"
                        required
                    />
                    <input
                        id = "location-input"
                        className = "location-field"
                        type="location"
                        placeholder="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        maxLength={85}
                        required
                    />
                </div>
                <textarea
                    id = "description-input"
                    className = "description-field"
                    type="description"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2500}
                    required
                />
                <div className="upload-box">
                    <p className="upload-title">Enter an image file</p>
                    <button
                        type="button"
                        className="upload-btn"
                        onClick={() => document.getElementById("imageInput").click()}
                    >
                        Choose File
                    </button>
                    <p className="upload-subtitle">*Empty or invalid images will result in a default image</p>

                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        style={{display: "none"}}
                        onChange={handleImageUpload}
                    />
                </div>
                <button className = "sub-btn" type="submit">Submit Event</button>
            </form>
        </div>
    )
}

export default Submission;