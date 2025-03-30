import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { state } = useLocation(); // Get passed data from CheckoutPage
  const { cart, userName, totalAmount, tax, paymentMethod, waitTime } = state;

  // Set time remaining to 20 seconds for this example
  const [timeRemaining, setTimeRemaining] = useState(20); 
  const [progress, setProgress] = useState(100); // Progress for the wait time
  const [currentStage, setCurrentStage] = useState("Preparing your smoothie..."); // Stage text

  useEffect(() => {
    let timeLeft = 20; // Time in seconds
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        setTimeRemaining(timeLeft); // Update time remaining in seconds
        setProgress((timeLeft / 20) * 100); // Update progress based on remaining time
      } else {
        clearInterval(interval);
        setCurrentStage("Smoothie ready! Grab it!");
      }
    }, 1000); // Update every 1 second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="confirmation-page">
      <h1>Order Confirmation</h1>

      <div className="order-details">
        <h2>Thank you for your order, {userName}!</h2>
        <h3>Order Summary:</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.totalPrice.toFixed(2)} x {item.quantity || 1}
            </li>
          ))}
        </ul>

        <h3>Payment Method: {paymentMethod === 'applePay' ? 'Apple Pay' : 'Credit Card'}</h3>
        <h3>Tax (8%): ${tax.toFixed(2)}</h3>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>

        <p>Your smoothie will be ready shortly!</p>
      </div>

      {/* Right Side: Wait time progress bar and stages */}
      <div className="order-status">
        <h3>{currentStage}</h3>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p>Time remaining: {timeRemaining} seconds</p>
      </div>

      <button className="go-home-button" onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
};

export default ConfirmationPage;
