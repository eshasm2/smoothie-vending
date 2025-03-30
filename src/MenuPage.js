import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./MenuPage.css";

const MenuPage = ({ cart, addToCart, handleRemoveFromCart }) => {
  const [smoothies, setSmoothies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSmoothies = async () => {
      // Try to get the smoothies from localStorage
      const cachedSmoothies = localStorage.getItem("smoothies");

      // If cached smoothies exist, use them
      if (cachedSmoothies) {
        setSmoothies(JSON.parse(cachedSmoothies));
      }

      // Fetch data from Supabase
      const { data, error } = await supabase.from("smoothies").select("*");
      if (error) {
        console.error("Error fetching smoothies:", error);
      } else {
        // Set the fresh data into state
        setSmoothies(data);

        // Update localStorage to store the fresh data
        localStorage.setItem("smoothies", JSON.stringify(data));
      }
    };

    fetchSmoothies();

    // Optional: clear localStorage when the component unmounts
    return () => {
      localStorage.removeItem("smoothies");
    };
  }, []);

  // Handle clicking on a smoothie to navigate to the details page
  const handleSmoothieClick = (smoothie) => {
    navigate(`/smoothie/${smoothie.id}`, { state: { smoothie } });
  };

  // Handle adding a smoothie to the cart
  const handleAddToCart = (smoothie) => {
    addToCart(smoothie);
  };

  return (
    <div className="menu-page">
      <h1>Smoothie Menu</h1>
      <div className="menu-grid">
        {smoothies.map((smoothie) => (
          <div 
            className="menu-item" 
            key={smoothie.id} 
            onClick={() => handleSmoothieClick(smoothie)} 
            style={{ cursor: "pointer" }}
          >
            <img className="smoothie-image" src={smoothie.image_url} alt={smoothie.name} />
            <h3>{smoothie.name}</h3>
            <p>${smoothie.price.toFixed(2)}</p>
            <button 
              onClick={(e) => { e.stopPropagation(); handleAddToCart(smoothie); }}
              style={{
                backgroundColor: "#81c784",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                border: "none",
                outline: "none",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="cart">
          <h2>Your Order</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price.toFixed(2)} x {item.quantity}
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    fontSize: "12px",  // Smaller font size
                    padding: "3px 8px",  // Smaller padding to make the button less wide
                    border: "none",
                    borderRadius: "5px",  // Rounded corners
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <h3>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h3>
          <button onClick={() => navigate("/checkout", { state: { cart } })}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
