import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SmoothieDetails.css"; // Import CSS file

const SmoothieDetails = ({ addToCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const smoothie = location.state?.smoothie;

  const [addIns, setAddIns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(smoothie.price);

  if (!smoothie) {
    return <p>Loading smoothie details...</p>;
  }

  const handleAddToOrder = () => {
    addToCart({ ...smoothie, addIns, totalPrice });
    navigate("/"); // Navigate back to the menu
  };

  const handleAddInsChange = (addIn) => {
    const newAddIns = addIns.includes(addIn)
      ? addIns.filter((item) => item !== addIn)
      : [...addIns, addIn]; // Toggle add-ins

    setAddIns(newAddIns);

    // Update price based on add-ins selected
    const addInPrice = addIn === "Collagen" ? 1.5 : addIn === "Chia Seeds" ? 0.5 : 0;
    setTotalPrice(smoothie.price + newAddIns.length * addInPrice);
  };

  return (
    <div className="smoothie-details">
      {/* Left Side: Image and Ingredients */}
      <div className="smoothie-left">
        <h1 className="smoothie-title">{smoothie.name}</h1>
        <img
          src={smoothie.image_url}
          alt={smoothie.name}
          className="smoothie-image"
        />
        <p className="smoothie-price">
          <strong>Price:</strong> ${totalPrice.toFixed(2)}
        </p>
        <p className="smoothie-ingredients">
          <strong>Ingredients:</strong> {smoothie.Ingredients || "No Ingredients listed"}
        </p>
      </div>

      {/* Right Side: Add-ins and Action Buttons */}
      <div className="smoothie-right">
        <h3 className="add-ins-title">Add-ins</h3>
        <div className="add-ins-buttons">
          <button
            onClick={() => handleAddInsChange("Collagen")}
            className={`add-ins-button ${addIns.includes("Collagen") ? "selected" : ""}`}
          >
            Collagen (+$1.50)
          </button>
          <button
            onClick={() => handleAddInsChange("Chia Seeds")}
            className={`add-ins-button ${addIns.includes("Chia Seeds") ? "selected" : ""}`}
          >
            Chia Seeds (+$0.50)
          </button>
        </div>

        <div className="action-buttons">
          <button onClick={handleAddToOrder} className="add-to-order-button">
            Add to Order
          </button>
          <button onClick={() => navigate("/")} className="back-to-menu-button">
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmoothieDetails;
