import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "./MenuPage";
import CheckoutPage from "./CheckoutPage";
import AdminPage from "./AdminPage";
import LoginScreen from "./LoginScreen";
import ConfirmationPage from "./ConfirmationPage"; // Import the new page

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
  });

  const handleLogin = (role = 'guest') => {
    setAuthState({
      isAuthenticated: true,
      userRole: role,
    });
  };

  const hasAdminAccess = () => {
    return authState.isAuthenticated && authState.userRole === 'admin';
  };

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        
        {/* Home/Menu route */}
        <Route path="/" element={authState.isAuthenticated ? <MenuPage userRole={authState.userRole} /> : <Navigate to="/login" />} />

        {/* Checkout route */}
        <Route path="/checkout" element={authState.isAuthenticated ? <CheckoutPage userRole={authState.userRole} /> : <Navigate to="/login" />} />

        {/* Admin route */}
        <Route path="/admin" element={hasAdminAccess() ? <AdminPage /> : <Navigate to="/" />} />

        {/* Confirmation route */}
        <Route path="/confirmation" element={<ConfirmationPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
