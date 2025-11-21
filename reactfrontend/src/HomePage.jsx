// src/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="page page-home">
      <div className="home-card">
        <h1>Event Planner</h1>
        <p className="home-description">
          This application lets you <strong>create, view, update, and delete</strong> events.
          Use it to keep track of deadlines, meetings, and reminders in one place.
        </p>

        <ul className="home-features">
          <li>Create events with title, date, time, and description</li>
          <li>See all of your events in a list</li>
          <li>Edit details when plans change</li>
          <li>Delete events you no longer need</li>
        </ul>

        <div className="home-actions">
          <Link to="/events/new" className="btn primary">Create Event</Link>
          <Link to="/events" className="btn secondary">View Events</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
