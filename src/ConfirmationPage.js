import React from 'react';
import { useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const { state } = useLocation(); // Get passed data from CheckoutPage

  const { cart, userName, totalAmount, tax, paymentMethod, waitTime } = state;

  return (
    <div className="confirmation-page">
      <h1>Order Confirmation</h1>

      <div className="order-details">
        <h2>Thank you for your order, {userName}!</h2>
        <h3>Order Summary:</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity || 1}
            </li>
          ))}
        </ul>

        <h3>Payment Method: {paymentMethod === 'applePay' ? 'Apple Pay' : 'Credit Card'}</h3>
        <h3>Tax (8%): ${tax.toFixed(2)}</h3>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>

        <h3>Estimated Wait Time: {waitTime} minutes</h3>
        <p>Your smoothie will be ready shortly!</p>
      </div>

      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
};

export default ConfirmationPage;
