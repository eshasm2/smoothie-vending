import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./ConfirmationPage.css";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const { cart, userName, totalAmount, tax, paymentMethod } = state;
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [progress, setProgress] = useState(100);
  const [currentStage, setCurrentStage] = useState("Preparing your smoothie...");

  // Countdown timer to update order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev > 1) {
          setProgress(((prev - 1) / 20) * 100); // Update progress bar
          return prev - 1;
        } else {
          clearInterval(interval);
          setCurrentStage("Smoothie ready! Grab it!"); 
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="confirmation-page">
      <h1>Order Confirmation</h1>
      <div className="order-details">
        <h2>Thank you, {userName}!</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.totalPrice.toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>
        <h3>Payment: {paymentMethod === "applePay" ? "Apple Pay" : "Credit Card"}</h3>
        <h3>Tax: ${tax.toFixed(2)}</h3>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
      </div>

      {/* Order progress section */}
      <div className="order-status">
        <h3>{currentStage}</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p>Time remaining: {timeRemaining} seconds</p>
      </div>

      <button onClick={() => (window.location.href = "/")}>Go to Home</button>
    </div>
  );
};

export default ConfirmationPage;
