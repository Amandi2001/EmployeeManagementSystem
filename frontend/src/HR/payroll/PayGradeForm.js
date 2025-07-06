import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const PayGradeForm = () => {
  const [form, setForm] = useState({
    gradeName: "",
    baseSalary: "",
    allowance: "",
    deduction: "",
    description: "", // <-- Added description
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/paygrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradeName: form.gradeName,
          baseSalary: parseFloat(form.baseSalary),
          allowance: parseFloat(form.allowance),
          deduction: parseFloat(form.deduction),
          description: form.description, // <-- Include description in POST body
        }),
      });
      setMessage("Pay grade saved successfully!");
      setForm({
        gradeName: "",
        baseSalary: "",
        allowance: "",
        deduction: "",
        description: "", // <-- Reset field
      });
    } catch (error) {
      setMessage("Error saving pay grade.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
         <div className="brand">EmpowerDesk HR</div>
        <nav>
          <Link to="/hr/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/hr/add-employee-user" className="nav-item">Add Employee & User</Link>
        
          <Link to="/hr/user-list" className="nav-item">User Management</Link>
          <Link to="/hr/manage-leaves" className="nav-item">Leave Requests</Link>
          <Link to="/hr/attendance" className="nav-item">Attendance Corrections</Link>
          <Link to="/hr/salaries/manage" className="nav-item ">Salary Management</Link>
                    <Link to="/hr/salaries/paygrade-form" className="nav-item active ">Paygrade Form</Link> 
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="section-title">Add Pay Grade</h2>

        <form className="paygrade-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Grade Name</label>
            <input
              type="text"
              name="gradeName"
              placeholder="Grade Name"
              value={form.gradeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Base Salary</label>
            <input
              type="number"
              name="baseSalary"
              placeholder="Base Salary"
              value={form.baseSalary}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Allowance</label>
            <input
              type="number"
              name="allowance"
              placeholder="Allowance"
              value={form.allowance}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Deduction</label>
            <input
              type="number"
              name="deduction"
              placeholder="Deduction"
              value={form.deduction}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Brief description of the pay grade"
              value={form.description}
              onChange={handleChange}
              rows={4}
              style={{ resize: "vertical" }}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Save Pay Grade
          </button>
        </form>

        {message && <p className="form-message">{message}</p>}
      </main>
    </div>
  );
};

export default PayGradeForm;
