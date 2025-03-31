import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './AdminPage.css';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders, inventory, and smoothie names from the database
        const { data: ordersData } = await supabase.from('orders').select('*').order('date', { ascending: false });
        const { data: inventoryData } = await supabase.from('inventory').select('smoothie_id, quantity_available');
        const { data: smoothiesData } = await supabase.from('smoothies').select('id, name');

        // Set orders state
        setOrders(ordersData || []);

        // Merge inventory data with smoothie names
        setInventory(
          inventoryData.map(item => ({
            ...item,
            smoothie_name: smoothiesData?.find(s => s.id === item.smoothie_id).name || 'Unknown'
          })) || []
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* Sales Data Section */}
      <section className="admin-section">
        <h2>Sales Data</h2>
        {orders.length ? (
          <table>
            <thead>
              <tr><th>Customer</th><th>Smoothies</th><th>Price</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.customer_name}</td>
                  <td>{order.smoothies.join(', ')}</td>
                  <td>${order.total_price}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No orders yet.</p>}
      </section>

      {/* Inventory Data Section */}
      <section className="admin-section">
        <h2>Inventory Data</h2>
        {inventory.length ? (
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Quantity</th></tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.smoothie_id}>
                  <td>{item.smoothie_id}</td>
                  <td>{item.smoothie_name}</td>
                  <td>{item.quantity_available}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No inventory data available.</p>}
      </section>
    </div>
  );
};

export default AdminPage;