import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './AdminPage.css'; // Ensure we create a CSS file for styling

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .order('date', { ascending: false });
        setOrders(ordersData);

        // Fetch inventory with the corresponding smoothie names
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('smoothie_id, quantity_available')
          .order('smoothie_id', { ascending: true });

        // Fetch smoothie names based on smoothie_id
        const { data: smoothiesData } = await supabase
          .from('smoothies')
          .select('id, name');

        // Merge the inventory with smoothie names
        const inventoryWithNames = inventoryData.map((item) => {
          const smoothie = smoothiesData.find((smoothie) => smoothie.id === item.smoothie_id);
          return { ...item, smoothie_name: smoothie ? smoothie.name : 'Unknown' };
        });

        setInventory(inventoryWithNames);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-page">
      <h1 className="admin-header">Admin Dashboard</h1>
      <div className="admin-grid">
        {/* Left Side: Sales Data */}
        <div className="admin-section">
          <h2 className="section-title">Sales Data</h2>
          {orders.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Smoothies Ordered</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.customer_name}</td>
                    <td>{order.smoothies.join(', ')}</td>
                    <td>${order.total_price}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No orders yet.</p>
          )}
        </div>

        {/* Right Side: Inventory Data */}
        <div className="admin-section">
          <h2 className="section-title">Inventory Data</h2>
          {inventory.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Smoothie ID</th>
                  <th>Smoothie Name</th>
                  <th>Available Quantity</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.smoothie_id}>
                    <td>{item.smoothie_id}</td>
                    <td>{item.smoothie_name}</td>
                    <td>{item.quantity_available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No inventory data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
