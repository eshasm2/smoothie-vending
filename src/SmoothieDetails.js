import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SmoothieDetails.css";

const SmoothieDetails = ({ addToCart }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const smoothie = state?.smoothie;

  // State for selected add-ins and total price
  const [addIns, setAddIns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(smoothie?.price || 0);

  if (!smoothie) return <p>Loading smoothie details...</p>;

  // Adds the smoothie  to the cart
  const handleAddToOrder = () => {
    addToCart({ ...smoothie, addIns, totalPrice });
    navigate("/");
  };

  // Toggles add-ins
  const handleAddInsChange = (addIn) => {
    const updatedAddIns = addIns.includes(addIn)
      ? addIns.filter(item => item !== addIn)
      : [...addIns, addIn];

    // Pricing logic for add-ins
    const addInPrice = addIn === "Collagen" ? 1.5 : addIn === "Chia Seeds" ? 0.5 : 0;

    setAddIns(updatedAddIns);
    setTotalPrice(smoothie.price + updatedAddIns.length * addInPrice);
  };

  // Add-in options
  const addInsOptions = [
    { name: "Collagen", price: 1.5 },
    { name: "Chia Seeds", price: 0.5 }
  ];

  return (
    <div className="smoothie-details">
      {/* Smoothie details section */}
      <div className="smoothie-left">
        <h1 className="smoothie-title">{smoothie.name}</h1>
        <img src={smoothie.image_url} alt={smoothie.name} className="smoothie-image" />
        <p className="smoothie-price"><strong>Price:</strong> ${totalPrice.toFixed(2)}</p>
        <p className="smoothie-ingredients"><strong>Ingredients:</strong> {smoothie.Ingredients || "No Ingredients listed"}</p>
      </div>

      {/* Add-ins and action buttons section */}
      <div className="smoothie-right">
        <h3 className="add-ins-title">Add-ins</h3>
        <div className="add-ins-buttons">
          {addInsOptions.map(({ name, price }) => (
            <button
              key={name}
              onClick={() => handleAddInsChange(name)}
              className={`add-ins-button ${addIns.includes(name) ? "selected" : ""}`}
            >
              {name} (+${price.toFixed(2)})
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button onClick={handleAddToOrder} className="add-to-order-button">Add to Order</button>
          <button onClick={() => navigate("/")} className="back-to-menu-button">Back to Menu</button>
        </div>
      </div>
    </div>
  );
};

export default SmoothieDetails;
