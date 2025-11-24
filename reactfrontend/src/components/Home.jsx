// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      {/* Top nav */}
      <nav className="home-nav">
        <div className="nav-left">
          <div className="nav-logo">UIC</div>
          <span className="nav-title">UIC Resource Finder</span>
        </div>
        <div className="nav-right">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="nav-button">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <main className="home-hero">
        <section className="hero-card">
          <h1>Discover UIC Campus Resources & Events</h1>

          <p className="hero-subtitle">
            UIC Resource Finder helps students quickly discover, share, and
            manage campus events, organizations, and support services in one
            place.
          </p>

          <ul className="hero-features">
            <li>✔ Search and filter campus resources instantly</li>
            <li>✔ Create, edit, and delete your own events</li>
            <li>✔ Smart suggestions and autocomplete for faster search</li>
            <li>✔ Clean, modern interface designed for UIC students</li>
          </ul>

          <div className="hero-actions">
            <Link to="/login" className="btn primary">
              Get Started – Login
            </Link>
            <Link to="/signup" className="btn secondary">
              Create an Account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
