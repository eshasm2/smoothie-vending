import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./MenuPage.css";

const MenuPage = ({ cart, addToCart, handleRemoveFromCart }) => {
  const [smoothies, setSmoothies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSmoothies = async () => {
      const cachedSmoothies = localStorage.getItem("smoothies");

      if (cachedSmoothies) {
        setSmoothies(JSON.parse(cachedSmoothies));
      }

      const { data, error } = await supabase.from("smoothies").select("*");
      if (error) {
        console.error("Error fetching smoothies:", error);
      } else {
        setSmoothies(data);
        localStorage.setItem("smoothies", JSON.stringify(data));
      }
    };

    fetchSmoothies();

    return () => {
      localStorage.removeItem("smoothies");
    };
  }, []);

  const handleSmoothieClick = (smoothie) => {
    navigate(`/smoothie/${smoothie.id}`, { state: { smoothie } });
  };

  return (
    <div className="menu-container">
      {/* Left Side - Smoothie List */}
      <div className="menu-left">
        <h1>Smoothie Menu</h1>
        <div className="menu-grid">
          {smoothies.map((smoothie) => (
            <div
              className="menu-item"
              key={smoothie.id}
              onClick={() => handleSmoothieClick(smoothie)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="smoothie-image"
                src={smoothie.image_url}
                alt={smoothie.name}
              />
              <h3>{smoothie.name}</h3>
              <p>${smoothie.price.toFixed(2)}</p>
              <div className="menu-item-footer">
                <button
                  className="more-info-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSmoothieClick(smoothie);
                  }}
                >
                  More Info
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Order Summary */}
      <div className="menu-right">
        <h2>Your Order</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item, index) => (
                <li key={index} className="cart-item">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    ${(item.totalPrice * item.quantity).toFixed(2)}
                  </span>
                  {item.addIns.length > 0 && (
                    <p className="add-ins">
                      <strong>Add-ins:</strong> {item.addIns.join(", ")}
                    </p>
                  )}
                  <button
                    onClick={() => handleRemoveFromCart(item.id, item.addIns)}
                    className="remove-button"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
            <h3>
              Total: $
              {cart
                .reduce((total, item) => total + item.totalPrice * item.quantity, 0)
                .toFixed(2)}
            </h3>
            <button
              onClick={() => navigate("/checkout", { state: { cart } })}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
