import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState(null); // Track current mode (guest, returning user, admin, sign up)
  const [name, setName] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  // Guest login 
  const handleGuestLogin = () => {
    onLogin("guest");
    navigate("/"); 
  };

  // Handle returning user login 
  const handleReturningUserLogin = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please enter both name and phone number.");
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = phone.replace(/\D/g, "");

      if (!phoneNumber) {
        setError("Please enter a valid phone number.");
        setLoading(false);
        return;
      }

      // Check if user exists in the database
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
        onLogin("user");
        navigate("/"); 
      } else {
        setError("No user found. Please sign up.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle admin login 
  const handleAdminLogin = async () => {
    if (!password.trim()) {
      setError("Please enter the admin password.");
      return;
    }

    setLoading(true);
    try {
      // Password check 
      if (password === "admin123") {
        onLogin("admin");
        navigate("/admin");
      } else {
        setError("Invalid admin password.");
      }
    } catch (err) {
      setError("Admin authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle user sign-up 
  const handleSignUp = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please enter both name and phone number.");
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = phone.replace(/\D/g, ""); 

      if (!phoneNumber) {
        setError("Please enter a valid phone number.");
        setLoading(false);
        return;
      }

      // Insert new user into database
      const { error: signUpError } = await supabase
        .from("users")
        .insert([{ name, phone: phoneNumber }]);

      if (signUpError) {
        setError("Error signing up: " + signUpError.message);
        setLoading(false);
        return;
      }

      onLogin("user");
      navigate("/"); 
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setMode(null);
    setError("");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0fff4" }}>
      <div style={{ padding: "24px", width: "350px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
        borderRadius: "16px", backgroundColor: "white" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Welcome</h2>

        {/* Display error message if any */}
        {error && (
          <div style={{ color: "red", textAlign: "center", marginBottom: "10px", padding: "8px", 
          backgroundColor: "rgba(254, 226, 226, 0.5)", borderRadius: "4px" }}>
            {error}
          </div>
        )}

        {/* Main login options */}
        {!mode && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button onClick={handleGuestLogin} style={buttonStyle("#34d399")}>Guest User</button>
            <button onClick={() => { setMode("returning"); setError(""); }} style={buttonStyle("#60a5fa")}>Returning User</button>
            <button onClick={() => { setMode("admin"); setError(""); }} style={buttonStyle("#8b5cf6")}>Admin</button>
            <button onClick={() => { setMode("signUp"); setError(""); }} style={buttonStyle("#fbbf24")}>Sign Up</button>
          </div>
        )}

        {/* Returning user login */}
        {mode === "returning" && (
          <div style={formContainer}>
            <button onClick={handleBack} style={backButtonStyle}>Back</button>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            <button onClick={handleReturningUserLogin} disabled={loading} style={submitButtonStyle("#60a5fa", loading)}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* Admin login */}
        {mode === "admin" && (
          <div style={formContainer}>
            <button onClick={handleBack} style={backButtonStyle}>Back</button>
            <input type="password" placeholder="Admin Password" value={password} 
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            <button onClick={handleAdminLogin} disabled={loading} style={submitButtonStyle("#8b5cf6", loading)}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {/* Sign-up form */}
        {mode === "signUp" && (
          <div style={formContainer}>
            <button onClick={handleBack} style={backButtonStyle}>Back</button>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
            <button onClick={handleSignUp} disabled={loading} style={submitButtonStyle("#fbbf24", loading)}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const buttonStyle = (backgroundColor) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor,
  color: "white",
  border: "none",
  cursor: "pointer",
});

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
};

const formContainer = { display: "flex", flexDirection: "column", gap: "12px" };

const backButtonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: "#e2e8f0",
  color: "#333",
  border: "none",
  cursor: "pointer",
};

const submitButtonStyle = (backgroundColor, loading) => ({
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: loading ? "#93c5fd" : backgroundColor,
  color: "white",
  border: "none",
  cursor: loading ? "default" : "pointer",
});
