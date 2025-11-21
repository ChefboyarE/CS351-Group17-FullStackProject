import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResourceSubmission.css";

// Default fallback image
const DEFAULT_IMAGE =
  "https://shop.undergroundshirts.com/cdn/shop/files/UIC-1021_1001072_18500_Navy_2.jpg?v=1751390090";

// Helper to get today's date in local format
const getLocalToday = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

function ResourceSubmission() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // If "?id=123" is present → edit mode enabled
  const resourceId = params.get("id");
  const isEdit = Boolean(resourceId);

  const [img, setImage] = useState(DEFAULT_IMAGE);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Prevent double submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing event (edit mode)
  useEffect(() => {
    if (!isEdit) return;

    async function loadEvent() {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/getResource/${resourceId}`
        );
        const data = await res.json();

        if (data) {
          setTitle(data.title || "");
          setDate(data.date || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setImage(data.img || DEFAULT_IMAGE);
        }
      } catch (err) {
        console.error("Error loading event:", err);
      }
    }

    loadEvent();
  }, [isEdit, resourceId]);

  // Submit handler for BOTH create + edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Title limit
    if (title.length > 60) {
      alert("Title must be 60 characters or fewer.");
      setIsSubmitting(false);
      return;
    }

    try {
      const route = isEdit
        ? `http://127.0.0.1:5000/updateResource/${resourceId}`
        : "http://127.0.0.1:5000/resourceSubmission";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(route, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          img,
          title,
          date,
          location,
          description,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(isEdit ? "Event updated!" : "Event submitted!");
        navigate("/resources"); // redirect after submit
      } else {
        alert(data.message || "Submission failed.");
      }

    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting event");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="submission-page">
      {/* Back button */}
      <button
        className="back-btn"
        onClick={() => navigate("/resources")}
      >
        ← Back
      </button>

      <div className="submission-card">
        <h1>{isEdit ? "Edit Event" : "Create Event"}</h1>

        <form className="submission-form" onSubmit={handleSubmit}>
          {/* TITLE */}
          <label>
            Title <span className="char-count">{title.length}/60</span>
            <input
              type="text"
              placeholder="Title"
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          {/* DATE */}
          <label>
            Date
            <input
              type="date"
              value={date}
              min={getLocalToday()}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          {/* LOCATION */}
          <label>
            Location
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>

          {/* DESCRIPTION */}
          <label>
            Description
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            ></textarea>
          </label>

          {/* IMAGE URL */}
          <label>
            Image URL
            <input
              type="text"
              placeholder="Image link"
              value={img}
              onChange={(e) => setImage(e.target.value)}
            />
          </label>

          {/* SUBMIT */}
          <button
            className="submit-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isEdit
              ? isSubmitting
                ? "Updating..."
                : "Update Event"
              : isSubmitting
              ? "Submitting..."
              : "Submit Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResourceSubmission;
