import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import LeaveRequestModal from "./LeaveRequestModal"; // Leave modal component
import "./AdminManageLeaves.css"; // Import the CSS we will define below

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  // Fetch leave requests
  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:9090/api/leaves");
      setLeaves(response.data);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Update leave status
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:9090/api/leaves/update-status/${id}`,
        { status },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchLeaves();
      setModalShow(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update leave status.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Open modal with selected leave
  const openModal = (leave) => {
    setSelectedLeave(leave);
    setModalShow(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedLeave(null);
    setModalShow(false);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">EmpowerDesk HR</div>
        <nav>
          <Link to="/hr/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/hr/add-employee-user" className="nav-item ">Add Employee & User</Link>         
           
          <Link to="/hr/user-list" className="nav-item">User Management</Link>
          <Link to="/hr/manage-leaves" className="nav-item active">Leave Requests</Link>
          <Link to="/hr/attendance" className="nav-item">Attendance Corrections</Link>
          <Link to="/hr/salaries/manage" className="nav-item ">Salary Management</Link>
          <Link to="/hr/salaries/paygrade-form" className="nav-item">Paygrade Form</Link> 
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h3>Manage Leave Requests</h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Username</th>
                <th>From</th>
                <th>To</th>
                <th className="reason-column">Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.username}</td>
                    <td>{leave.fromDate}</td>
                    <td>{leave.toDate}</td>
                    <td className="reason-column">{leave.reason}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          leave.status === "APPROVED"
                            ? "success"
                            : leave.status === "REJECTED"
                            ? "danger"
                            : "warning"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => openModal(leave)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleUpdateStatus(leave.id, "APPROVED")}
                        disabled={leave.status !== "PENDING"}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleUpdateStatus(leave.id, "REJECTED")}
                        disabled={leave.status !== "PENDING"}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        show={modalShow}
        onHide={closeModal}
        leave={selectedLeave}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default ManageLeaves;
