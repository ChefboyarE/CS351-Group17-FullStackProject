import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResourceList from "./components/ResourceList";
import ResourceSubmission from "./components/ResourceSubmission";
import { AuthProvider, useAuth } from "./components/AuthProvider";

const ProtectedRoute = () => {
  const {isLoggedIn} = useAuth();

  if (isLoggedIn) {
    return <Outlet />;
  }

  return <Navigate to = "/login" replace />;
};

const UnauthenticatedRoute = () => {
  const {isLoggedIn} = useAuth();
  if (isLoggedIn) {
    return <Navigate to= "/resources" replace />;
  }

  return <Outlet />;
}

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const handleLogin = () => {
  //   // setIsLoggedIn(true); // set login status
  // };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Routes that only unauthenticated could access */}
          <Route element={<UnauthenticatedRoute />}>
            {/* Login route */}
            <Route
              path="/login"
              element={<Login/>}
            />

            {/* Signup route */}
            <Route
              path="/signup"
              element={<Signup />}
            />
          </Route>

          {/* Protected routes that can only be accessed when authenticated */}
          <Route element={<ProtectedRoute />}>
            {/* Protected resource list/dashboard */}
            <Route
              path="/resources"
              element={<ResourceList/>}
            />

            {/* Protected resource submission page */}
            <Route
              path = "/resourceSubmission"
              element={<ResourceSubmission />} 
            />

            {/* Default route */}
            <Route
              path="/"
              element={<Navigate to="/login"/>}
            />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
