import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResourceList from "./components/ResourceList";
import ResourceSubmission from "./components/ResourceSubmission";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import Home from "./components/Home";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

const UnauthenticatedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/resources" replace /> : <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* PUBLIC HOME PAGE */}
          <Route path="/" element={<Home />} />

          {/* UNAUTH ROUTES */}
          <Route element={<UnauthenticatedRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/resources" element={<ResourceList />} />
            <Route path="/resourceSubmission" element={<ResourceSubmission />} />
            <Route path="/resourceSubmission/:id" element={<ResourceSubmission />} />
          </Route>

          {/* OPTIONAL: Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
