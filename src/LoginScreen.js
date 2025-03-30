import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

// LoginScreen Component
export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState(null); // Tracks the current mode (guest, returning user, admin)
  const [phone, setPhone] = useState(""); // Phone number for returning user
  const [name, setName] = useState(""); // Name for returning user
  const [password, setPassword] = useState(""); // Password for admin login
  const [error, setError] = useState(""); // Error message
  const [loading, setLoading] = useState(false); // Loading state for database operations
  const navigate = useNavigate(); // For navigation after successful login

  // Function for guest login
  const handleGuestLogin = () => {
    console.log("Guest login");
    onLogin("guest"); // Set user as authenticated with role
    navigate("/"); // Navigate to the MenuPage
  };

  // Function for returning user login
  const handleReturningUserLogin = async () => {
    // Validate inputs
    if (!name.trim() || !phone.trim()) {
      setError("Please enter both name and phone number");
      return;
    }

    setLoading(true);
    try {
      // Clean phone number - remove non-numeric characters
      const phoneNumber = phone.replace(/\D/g, "");
      
      if (!phoneNumber) {
        setError("Please enter a valid phone number");
        setLoading(false);
        return;
      }

      console.log("Saving user data:", { name, phone: phoneNumber });

      // Insert name and phone number into Supabase
      const { data, error: supabaseError } = await supabase
        .from("users")
        .upsert({ 
          name, 
          phone: phoneNumber,
          created_at: new Date().toISOString() // Only set for new records due to upsert
        }, { 
          onConflict: 'phone' // This ensures we don't create duplicates
        });

      if (supabaseError) {
        console.error("Error saving user data:", supabaseError);
        setError("Failed to save user data: " + supabaseError.message);
      } else {
        console.log("User data saved successfully:", data);
        onLogin("user"); // Set user as authenticated
        navigate("/"); // Navigate to the MenuPage
      }
    } catch (err) {
      console.error("Error in login process:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function for admin login
  const handleAdminLogin = async () => {
    if (!password.trim()) {
      setError("Please enter the admin password");
      return;
    }

    setLoading(true);
    try {
      // Simple admin password check - in production, use proper authentication
      if (password === "admin123") { // Replace with secure verification
        console.log("Admin login successful");
        onLogin("admin");
        navigate("/admin");
      } else {
        setError("Invalid admin password");
      }
    } catch (err) {
      console.error("Error in admin login:", err);
      setError("Admin authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0fff4",
      }}
    >
      <div
        style={{
          padding: "24px",
          width: "350px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
          backgroundColor: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome</h2>
        
        {/* Error message display */}
        {error && (
          <div style={{ 
            color: "red", 
            textAlign: "center", 
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "rgba(254, 226, 226, 0.5)",
            borderRadius: "4px" 
          }}>
            {error}
          </div>
        )}

        {/* Main login options */}
        {!mode && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleGuestLogin}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#34d399",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Guest User
            </button>
            <button
              onClick={() => {
                setMode("phone");
                setError("");
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#60a5fa",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Returning User
            </button>
            <button
              onClick={() => {
                setMode("admin");
                setError("");
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Admin
            </button>
          </div>
        )}

        {/* Returning user login */}
        {mode === "phone" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
            <button
              onClick={handleReturningUserLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: loading ? "#93c5fd" : "#60a5fa",
                color: "white",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Login"}
            </button>
            <button
              onClick={() => {
                setMode(null);
                setError("");
              }}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#d1d5db",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              Back
            </button>
          </div>
        )}

        {/* Admin login */}
        {mode === "admin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
            <button
              onClick={handleAdminLogin}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: loading ? "#c4b5fd" : "#8b5cf6",
                color: "white",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Login as Admin"}
            </button>
            <button
              onClick={() => {
                setMode(null);
                setError("");
              }}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#d1d5db",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}