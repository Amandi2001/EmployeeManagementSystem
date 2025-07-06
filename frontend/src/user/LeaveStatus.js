import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./UserDashboard.css";

const LeaveStatusPage = () => {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Step 1: Get employee info by userId → fetch leaves
    axios
      .get(`http://localhost:9090/api/v1/employees/by-userid/${userId}`)
      .then((res) => {
        const empId = res.data.id;
        return axios.get(`http://localhost:9090/api/leaves/user/${empId}`);
      })
      .then((res) => {
        setLeaves(res.data);
      })
      .catch((err) => {
        console.error("Failed to load leave data:", err);
      });
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  const getStatusBadge = (status) => {
    const statusStr = typeof status === "string" ? status : status?.name || "PENDING";
    let className = "warning";

    if (statusStr === "APPROVED") className = "success";
    else if (statusStr === "REJECTED") className = "danger";

    return <span className={`badge bg-${className}`}>{statusStr}</span>;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">EmpowerDesk User</div>
        <nav>
          <Link to="/user/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/user/profile" className="nav-item">My Profile</Link>
          <Link to="/user/apply-leave" className="nav-item">Apply Leave</Link>
          <Link to="/user/leave-status" className="nav-item active">Leave Status</Link>
          <Link to="/user/attendance" className="nav-item">Attendance</Link><br />
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h3 className="section-title text-center">My Leave Requests</h3>

        <table className="table table-bordered table-striped mt-4">
          <thead className="table-dark">
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{formatDate(leave.fromDate)}</td>
                  <td>{formatDate(leave.toDate)}</td>
                  <td>{leave.reason}</td>
                  <td>{getStatusBadge(leave.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default LeaveStatusPage;
