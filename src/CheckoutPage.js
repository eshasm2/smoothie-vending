import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { state } = useLocation(); // Get cart data passed from the MenuPage
  const [userName, setUserName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('applePay');
  const [totalAmount, setTotalAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const calculateTotal = () => {
      const subtotal = state.cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
      const taxAmount = subtotal * 0.08; // Standard 8% tax rate
      setTotalAmount(subtotal + taxAmount);
      setTax(taxAmount);
    };
    calculateTotal();

    const fetchUserData = async () => {
      const { data: user, error } = await supabase.auth.getUser(); // Get user data

      if (error) {
        console.error('Error fetching user data:', error);
      } else if (user) {
        setUserName(user.user_metadata?.name || ''); // Default to empty if no name in metadata
      }
    };

    fetchUserData();
  }, [state.cart]);

  const handlePlaceOrder = async () => {
    if (!userName) {
      alert('Please enter your name to proceed with the order!');
      return;
    }

    // Save the order in Supabase
    const orderData = {
      customer_name: userName,
      smoothies: state.cart.map(item => item.id), // Only save smoothie IDs
      total_price: totalAmount,
      date: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('orders')
      .insert([orderData]);

    if (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order, please try again.');
    } else {
      // Navigate to the confirmation page with order details and wait time
      navigate('/confirmation', {
        state: {
          cart: state.cart,
          userName: userName,
          totalAmount: totalAmount,
          tax: tax,
          paymentMethod: paymentMethod,
          waitTime: Math.floor(Math.random() * (15 - 5 + 1)) + 5 // Random wait time between 5 and 15 minutes
        }
      });
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        <h2>Your Order Summary</h2>
        <ul>
          {state.cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity || 1}
            </li>
          ))}
        </ul>

        <div className="user-info">
          <label htmlFor="user-name">Name:</label>
          <input
            id="user-name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="payment-method">
          <h3>Choose Payment Method</h3>
          <label>
            <input
              type="radio"
              value="applePay"
              checked={paymentMethod === 'applePay'}
              onChange={() => setPaymentMethod('applePay')}
            />
            Apple Pay
          </label>
          <label>
            <input
              type="radio"
              value="creditCard"
              checked={paymentMethod === 'creditCard'}
              onChange={() => setPaymentMethod('creditCard')}
            />
            Credit Card
          </label>
        </div>

        <h3>Tax (8%): ${tax.toFixed(2)}</h3>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>

        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>

      <button onClick={() => navigate(-1)}>Back to Menu</button>
    </div>
  );
};

export default CheckoutPage;
