import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "./MenuPage";
import SmoothieDetails from "./SmoothieDetails";
import CheckoutPage from "./CheckoutPage";
import AdminPage from "./AdminPage";
import LoginScreen from "./LoginScreen";
import ConfirmationPage from "./ConfirmationPage";

const App = () => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
  });

  const [cart, setCart] = useState([]);

  const addToCart = (smoothie) => {
    setCart((prevCart) => {
      const existingSmoothie = prevCart.find(item => item.id === smoothie.id);
      if (existingSmoothie) {
        return prevCart.map(item =>
          item.id === smoothie.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...smoothie, quantity: 1 }];
      }
    });
  };

  const handleLogin = (role = "guest") => {
    setAuthState({
      isAuthenticated: true,
      userRole: role,
    });
  };

  const hasAdminAccess = () => {
    return authState.isAuthenticated && authState.userRole === "admin";
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        <Route 
          path="/" 
          element={authState.isAuthenticated ? <MenuPage cart={cart} addToCart={addToCart} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/smoothie/:id" 
          element={authState.isAuthenticated ? <SmoothieDetails addToCart={addToCart} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/checkout" 
          element={authState.isAuthenticated ? <CheckoutPage cart={cart} /> : <Navigate to="/login" />} 
        />
        <Route path="/admin" element={hasAdminAccess() ? <AdminPage /> : <Navigate to="/" />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
