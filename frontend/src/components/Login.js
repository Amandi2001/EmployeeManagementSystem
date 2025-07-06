import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:9090/api/auth/login", {
        username,
        password,
      });

      const { id, username: returnedUsername, role: returnedRole } = response.data;

      if (!id) throw new Error("No user ID returned from backend");

      localStorage.setItem("userId", id);
      localStorage.setItem("username", returnedUsername);
      localStorage.setItem("role", returnedRole);

      login(returnedRole);

      if (returnedRole === "ROLE_ADMIN") navigate("/admin/dashboard");
      else if (returnedRole === "ROLE_HR") navigate("/hr/dashboard");
      else if (returnedRole === "ROLE_USER") navigate("/user/dashboard");
      else navigate("/unauthorized");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay">
        <div className="company-brand">EmpowerDesk</div>
        <div className="login-card">
          <h1 className="welcome-message">Welcome to EMS</h1>
          
          <p className="sign-in-text">Please log in to continue</p>
          {error && <p className="error-text">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_HR">HR</option>
                <option value="ROLE_USER">User</option>
              </select>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
