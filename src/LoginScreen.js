import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

// LoginScreen Component
export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState(null); // Tracks the current mode (guest, returning user, admin, sign up)
  const [name, setName] = useState(""); // Name for user
  const [phone, setPhone] = useState(""); // Phone number for user
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
    if (!name.trim() || !phone.trim()) {
      setError("Please enter both name and phone number.");
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = phone.replace(/\D/g, ""); // Clean phone number to remove non-numeric characters

      if (!phoneNumber) {
        setError("Please enter a valid phone number.");
        setLoading(false);
        return;
      }

      // Check if the phone number exists in Supabase
      const { data, error: phoneError } = await supabase
        .from("users")
        .select("phone")
        .eq("phone", phoneNumber)
        .single();

      if (phoneError) {
        setError("Error checking user.");
        setLoading(false);
        return;
      }

      if (data) {
        console.log("Returning user data found:", data);
        onLogin("user"); // Set user as authenticated
        navigate("/"); // Navigate to the MenuPage
      } else {
        setError("No user found. Please sign up first.");
      }
    } catch (err) {
      console.error("Error in process:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function for admin login
  const handleAdminLogin = async () => {
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    setLoading(true);
    try {
      // Simple admin password check - replace with secure method in production
      if (password === "admin123") {
        console.log("Admin login successful");
        onLogin("admin");
        navigate("/admin");
      } else {
        setError("Invalid admin password.");
      }
    } catch (err) {
      console.error("Error in admin login:", err);
      setError("Admin authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Function for sign-up
  const handleSignUp = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please enter both name and phone number.");
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = phone.replace(/\D/g, ""); // Clean phone number to remove non-numeric characters

      if (!phoneNumber) {
        setError("Please enter a valid phone number.");
        setLoading(false);
        return;
      }

      // Insert name and phone number into Supabase
      const { error: signUpError } = await supabase
        .from("users")
        .insert([{ name, phone: phoneNumber }]);

      if (signUpError) {
        setError("Error signing up: " + signUpError.message);
        setLoading(false);
        return;
      }

      console.log("Sign up successful");
      onLogin("user"); // Set user as authenticated
      navigate("/"); // Navigate to the MenuPage
    } catch (err) {
      console.error("Error in sign-up process:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle back to main options
  const handleBack = () => {
    setMode(null);
    setError(""); // Clear any previous error
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
          <div
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "10px",
              padding: "8px",
              backgroundColor: "rgba(254, 226, 226, 0.5)",
              borderRadius: "4px",
            }}
          >
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
                setMode("returning");
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
            <button
              onClick={() => {
                setMode("signUp");
                setError("");
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#fbbf24",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Returning user login */}
        {mode === "returning" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleBack} // Back button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#e2e8f0",
                color: "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back
            </button>
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* Admin login */}
        {mode === "admin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleBack} // Back button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#e2e8f0",
                color: "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back
            </button>
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
                backgroundColor: loading ? "#93c5fd" : "#8b5cf6",
                color: "white",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* Sign up */}
        {mode === "signUp" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleBack} // Back button
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#e2e8f0",
                color: "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back
            </button>
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
              onClick={handleSignUp}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: loading ? "#93c5fd" : "#fbbf24",
                color: "white",
                border: "none",
                cursor: loading ? "default" : "pointer",
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
