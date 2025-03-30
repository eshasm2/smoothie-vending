import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const MenuPage = () => {
  const [smoothies, setSmoothies] = useState([]);
  const [cart, setCart] = useState([]);  // Stores selected smoothies
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase.from('smoothies').select('*');
      if (error) console.error('Error fetching smoothies:', error);
      else setSmoothies(data);
    };
    fetchSmoothies();
  }, []);

  const handleAddToOrder = (smoothie) => {
    setCart((prevCart) => {
      const existingSmoothie = prevCart.find(item => item.id === smoothie.id);
      if (existingSmoothie) {
        // If smoothie already in cart, increment quantity
        return prevCart.map(item =>
          item.id === smoothie.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If smoothie not in cart, add to cart with quantity 1
        return [...prevCart, { ...smoothie, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromOrder = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index)); // Remove item by index
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } }); // Pass cart data to checkout page
  };

  return (
    <div className="menu-page">
      <h1>Smoothie Menu</h1>
      <div className="menu-grid">
        {smoothies.map((smoothie) => (
          <div className="menu-item" key={smoothie.id}>
            <img className="smoothie-image" src={smoothie.image_url} alt={smoothie.name} />
            <h3>{smoothie.name}</h3>
            <p>${smoothie.price.toFixed(2)}</p>
            <button onClick={() => handleAddToOrder(smoothie)}>Add to Order</button>
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
                <button onClick={() => handleRemoveFromOrder(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h3>
          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;