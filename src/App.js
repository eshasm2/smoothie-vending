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
      // Ensure smoothie always has a totalPrice
      const updatedSmoothie = {
        ...smoothie,
        totalPrice: smoothie.totalPrice ?? smoothie.price,
        addIns: smoothie.addIns ?? [],
      };

      // Find if the same smoothie (with the same add-ins) exists in the cart
      const existingSmoothie = prevCart.find(
        (item) =>
          item.id === updatedSmoothie.id &&
          JSON.stringify(item.addIns) === JSON.stringify(updatedSmoothie.addIns)
      );

      if (existingSmoothie) {
        // If found, increase quantity
        return prevCart.map((item) =>
          item.id === updatedSmoothie.id &&
          JSON.stringify(item.addIns) === JSON.stringify(updatedSmoothie.addIns)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Otherwise, add as a new entry
        return [...prevCart, { ...updatedSmoothie, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (id, addIns) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id && JSON.stringify(item.addIns) === JSON.stringify(addIns)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleLogin = (role = "guest") => {
    setAuthState({
      isAuthenticated: true,
      userRole: role,
    });
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      userRole: null,
    });
  };

  const hasAdminAccess = () => {
    return authState.isAuthenticated && authState.userRole === "admin";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginScreen onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            authState.isAuthenticated ? (
              <MenuPage
                cart={cart}
                addToCart={addToCart}
                handleRemoveFromCart={handleRemoveFromCart}
                handleLogout={handleLogout} // Allow logout from menu
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/smoothie/:id"
          element={
            authState.isAuthenticated ? (
              <SmoothieDetails addToCart={addToCart} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/checkout"
          element={
            authState.isAuthenticated ? (
              <CheckoutPage
                cart={cart}
                handleRemoveFromCart={handleRemoveFromCart}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={hasAdminAccess() ? <AdminPage /> : <Navigate to="/" />}
        />
        <Route
          path="/confirmation"
          element={<ConfirmationPage cart={cart} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
