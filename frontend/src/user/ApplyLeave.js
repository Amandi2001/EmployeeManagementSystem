import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./UserDashboard.css"; // sidebar styles stay unchanged

const ApplyLeavePage = () => {
  const [leaveType, setLeaveType] = useState("Casual");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await axios.post("http://localhost:9090/api/leaves/apply", {
        username,
        leaveType,
        fromDate,
        toDate,
        reason,
        contactDuringLeave: contact,
      });

      setSuccess("✅ Leave applied successfully!");
      setLeaveType("Casual");
      setFromDate("");
      setToDate("");
      setReason("");
      setContact("");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to apply for leave. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        .apply-leave-main {
          flex-grow: 1;
          padding: 40px 50px;
          background-color: #f4f7fb;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
        }
        .apply-leave-container {
          background: white;
          border-radius: 20px;
          padding: 30px 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .apply-leave-title {
          font-weight: 700;
          font-size: 2rem;
          color: #3b4252;
          text-align: center;
          margin-bottom: 30px;
          user-select: none;
        }
        form label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 8px;
          display: inline-block;
        }
        form select,
        form input[type="date"],
        form input[type="text"],
        form textarea {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 20px;
          border-radius: 10px;
          border: 1.8px solid #cbd5e1;
          font-size: 1rem;
          font-weight: 500;
          transition: border-color 0.3s ease;
          outline-offset: 2px;
        }
        form select:focus,
        form input[type="date"]:focus,
        form input[type="text"]:focus,
        form textarea:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 5px rgba(79, 70, 229, 0.6);
        }
        form textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }
        .btn-primary {
          background-color: #4f46e5;
          color: white;
          font-weight: 700;
          border: none;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          user-select: none;
        }
        .btn-primary:hover {
          background-color: #4338ca;
          box-shadow: 0 0 12px rgba(67, 56, 202, 0.6);
        }
        .alert {
          border-radius: 12px;
          padding: 14px 20px;
          font-weight: 600;
          margin-bottom: 25px;
          text-align: center;
          user-select: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
        }
        .alert-success {
          background-color: #d1fae5;
          color: #065f46;
          border: 1.5px solid #10b981;
        }
        .alert-danger {
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1.5px solid #ef4444;
        }
      `}</style>

      <div className="dashboard-container">
        {/* Sidebar remains unchanged */}
        <aside className="sidebar">
          <div className="brand">EmpowerDesk User</div>
          <nav>
            <Link to="/user/dashboard" className="nav-item">
              Dashboard
            </Link>
            <Link to="/user/profile" className="nav-item">My Profile</Link>
            <Link to="/user/apply-leave" className="nav-item active">
              Apply Leave
            </Link>
            <Link to="/user/leave-status" className="nav-item">
              Leave Status
            </Link>
            <Link to="/user/attendance" className="nav-item">Attendance</Link><br />
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content apply-leave-main">
          <div className="apply-leave-container">
            <h3 className="apply-leave-title">Apply for Leave</h3>

            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="leaveType">Leave Type</label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Maternity">Maternity Leave</option>
                <option value="Emergency">Emergency Leave</option>
              </select>

              <label htmlFor="fromDate">From Date</label>
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />

              <label htmlFor="toDate">To Date</label>
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />

              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />

              <label htmlFor="contact">Contact During Leave</label>
              <input
                type="text"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Optional"
              />

              <button type="submit" className="btn-primary">
                Apply Leave
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default ApplyLeavePage;
