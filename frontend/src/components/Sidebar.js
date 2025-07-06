import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav
        style={{
          width: "220px",
          backgroundColor: "#222",
          color: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          boxSizing: "border-box",
        }}
      >
        <h2 style={{ color: "#f39c12", marginBottom: "30px" }}>Admin Panel</h2>

        <Link
          to="/admin/add-employee"
          style={{
            color: "#fff",
            textDecoration: "none",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#34495e",
          }}
        >
          Add Employee
        </Link>

        <Link
          to="/admin/manage-employees"
          style={{
            color: "#fff",
            textDecoration: "none",
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#34495e",
          }}
        >
          Manage Employees
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px",
            backgroundColor: "#e74c3c",
            border: "none",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flexGrow: 1,
          padding: "40px",
          backgroundColor: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        <h1>Welcome Admin</h1>
        <p>Use the sidebar to manage employees or add new ones.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
