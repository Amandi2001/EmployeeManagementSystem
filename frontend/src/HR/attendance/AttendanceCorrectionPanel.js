import React, { useState, useEffect } from "react";
import { Table, Button, Badge } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../HRDashboard.css"; // Reuse AdminDashboard styling

const AttendanceCorrectionPanel = () => {
  const [records, setRecords] = useState([]);

  // Fetch all correction requests
  const fetchCorrections = () => {
    axios
      .get("http://localhost:9090/api/v1/attendance/corrections")
      .then((res) => setRecords(res.data))
      .catch((err) =>
        console.error("Failed to fetch attendance corrections:", err)
      );
  };

  useEffect(() => {
    fetchCorrections();
  }, []);

  // Approve or reject request
  const handleStatusChange = (id, newStatus) => {
    axios
      .put(
        `http://localhost:9090/api/v1/attendance/corrections/${id}/status`,
        null,
        {
          params: { status: newStatus },
        }
      )
      .then(() => fetchCorrections())
      .catch((err) => console.error("Failed to update correction status:", err));
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
          <Link to="/hr/dashboard" className="nav-item">
            Dashboard
          </Link>
          <Link to="/hr/add-employee-user" className="nav-item">
            Add Employee & User
          </Link>

          <Link to="/hr/user-list" className="nav-item">
            User Management
          </Link>
          <Link to="/hr/manage-leaves" className="nav-item">
            Leave Requests
          </Link>
          <Link to="/hr/attendance" className="nav-item active">
            Attendance Corrections
          </Link>
          <Link to="/hr/salaries/manage" className="nav-item ">Salary Management</Link>
                    <Link to="/hr/salaries/paygrade-form" className="nav-item">Paygrade Form</Link> 
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="section-title">Attendance Correction Requests</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Note</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No pending requests.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id}>
                  <td>{rec.employee?.firstName} {rec.employee?.lastName}</td>
                  <td>{rec.date}</td>
                  <td>{rec.checkInTime || "-"}</td>
                  <td>{rec.checkOutTime || "-"}</td>
                  <td>{rec.correctionNote || "-"}</td>
                  <td>
                    <Badge
                      bg={
                        rec.status === "CORRECTION_PENDING"
                          ? "warning"
                          : rec.status === "CORRECTION_APPROVED"
                          ? "success"
                          : rec.status === "CORRECTION_REJECTED"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {rec.status.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() =>
                        handleStatusChange(rec.id, "CORRECTION_APPROVED")
                      }
                      disabled={rec.status === "CORRECTION_APPROVED"}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() =>
                        handleStatusChange(rec.id, "CORRECTION_REJECTED")
                      }
                      disabled={rec.status === "CORRECTION_REJECTED"}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </main>
    </div>
  );
};

export default AttendanceCorrectionPanel;
