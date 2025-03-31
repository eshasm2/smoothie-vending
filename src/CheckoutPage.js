import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { state } = useLocation(); // Access cart data 
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("applePay");
  const [totalAmount, setTotalAmount] = useState(0);
  const [tax, setTax] = useState(0);

  // Calculate tax and total amount based on cart items
  useEffect(() => {
    const subtotal = state.cart.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
    const taxAmount = subtotal * 0.08;
    setTax(taxAmount);
    setTotalAmount(subtotal + taxAmount);
  }, [state.cart]);

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!userName) return alert("Enter your name to continue!");

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: userName,
        smoothies: state.cart.map((item) => item.id),
        total_price: totalAmount,
        date: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("Order failed, try again.");
    } else {
      navigate("/confirmation", {
        state: { cart: state.cart, userName, totalAmount, tax, paymentMethod, waitTime: Math.floor(Math.random() * 11) + 5 },
      });
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        <h2>Your Order</h2>
        <ul>
          {state.cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.totalPrice.toFixed(2)} x {item.quantity}
            </li>
          ))}
        </ul>

        {/* Input for customer name */}
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your name" />

        {/* Payment method selection */}
        <div>
          <h3>Payment Method</h3>
          <label>
            <input type="radio" value="applePay" checked={paymentMethod === "applePay"} onChange={() => setPaymentMethod("applePay")} />
            Apple Pay
          </label>
          <label>
            <input type="radio" value="creditCard" checked={paymentMethod === "creditCard"} onChange={() => setPaymentMethod("creditCard")} />
            Credit Card
          </label>
        </div>

        <h3>Tax: ${tax.toFixed(2)}</h3>
        <h3>Total: ${totalAmount.toFixed(2)}</h3>

        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default CheckoutPage;
