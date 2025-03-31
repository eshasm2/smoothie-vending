import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuPage from "./MenuPage";
import SmoothieDetails from "./SmoothieDetails";
import CheckoutPage from "./CheckoutPage";
import AdminPage from "./AdminPage";
import LoginScreen from "./LoginScreen";
import ConfirmationPage from "./ConfirmationPage";

const App = () => {
  const [authState, setAuthState] = useState({ isAuthenticated: false, userRole: null });
  const [cart, setCart] = useState([]);

  const addToCart = (smoothie) => {
    setCart((prevCart) =>
      prevCart.some((item) => item.id === smoothie.id)
        ? prevCart.map((item) => (item.id === smoothie.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...prevCart, { ...smoothie, quantity: 1 }]
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0)
    );
  };

  const handleLogin = (role = "guest") => setAuthState({ isAuthenticated: true, userRole: role });
  const handleLogout = () => setAuthState({ isAuthenticated: false, userRole: null });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
        
        {authState.isAuthenticated? (
          <>
            <Route path="/" element={<MenuPage cart={cart} addToCart={addToCart} 
            handleRemoveFromCart={handleRemoveFromCart} handleLogout={handleLogout} />} />
            <Route path="/smoothie/:id" element={<SmoothieDetails addToCart={addToCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} handleRemoveFromCart={handleRemoveFromCart} />} />
            <Route path="/confirmation" element={<ConfirmationPage cart={cart} />} />
            {authState.userRole === "admin" && <Route path="/admin" element={<AdminPage />} />}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
