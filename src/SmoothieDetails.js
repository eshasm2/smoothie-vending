import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SmoothieDetails = ({ addToCart }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const smoothie = location.state?.smoothie;

  if (!smoothie) {
    return <p>Loading smoothie details...</p>;
  }

  const handleAddToOrder = () => {
    addToCart(smoothie); // Add smoothie to the cart
    navigate("/"); // Navigate back to the menu
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>{smoothie.name}</h1>
      <img 
        src={smoothie.image_url} 
        alt={smoothie.name} 
        style={{ width: "200px", borderRadius: "10px" }} 
      />
      <p><strong>Price:</strong> ${smoothie.price.toFixed(2)}</p>
      <p><strong>Ingredients:</strong> {smoothie.Ingredients || "No Ingredients listed"}</p>
      
      {/* Add to Cart button */}
      <button onClick={handleAddToOrder} style={{ margin: "10px" }}>Add to Order</button>
      <button onClick={() => navigate("/")}>Back to Menu</button>
    </div>
  );
};

export default SmoothieDetails;
