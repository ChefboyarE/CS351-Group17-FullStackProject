import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResourceList from "./components/ResourceList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true); // set login status
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/resources" /> : <Login onLogin={handleLogin} />}
        />

        {/* Signup route */}
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/resources" /> : <Signup />}
        />

        {/* Protected resource list/dashboard */}
        <Route
          path="/resources"
          element={isLoggedIn ? <ResourceList /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/resources" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
