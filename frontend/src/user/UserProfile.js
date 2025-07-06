import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaBriefcase,
  FaPhoneAlt,
  FaCalendarAlt,
  FaSignOutAlt,
  FaDownload,
} from "react-icons/fa";
import "./UserDashboard.css"; // Keep your existing sidebar styles here

const UserProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.warn("❗ No userId found in localStorage");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:9090/api/v1/employees/by-userid/${userId}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => console.error("❌ Error fetching employee data:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return <p className="loading">Loading profile...</p>;
  if (!userId) return <p className="error-msg">User not logged in. Please login first.</p>;
  if (!employee) return <p className="error-msg">No employee data found.</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar (unchanged) */}
      <aside className="sidebar">
        <div className="brand">Employee Panel</div>
        <nav>
          <Link to="/user/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/user/profile" className="nav-item active">My Profile</Link>
          <Link to="/user/apply-leave" className="nav-item">Apply Leave</Link>
          <Link to="/user/leave-status" className="nav-item">Leave Status</Link>
          <Link to="/user/attendance" className="nav-item">Attendance</Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content - updated modern professional look */}
      <main className="main-content user-profile-main">
        <h2 className="section-title">
          👤 {employee.firstName} {employee.lastName}'s Profile
        </h2>

        <div className="user-profile-card">
          {/* Profile Image */}
          <div className="user-profile-image">
            {employee.profilePicture ? (
              <img
                src={`http://localhost:9090/${employee.profilePicture}`}
                alt="Profile"
                className="profile-img"
              />
            ) : (
              <FaUserCircle className="default-user-icon" />
            )}
          </div>

          {/* Profile Details */}
          <div className="user-profile-details">
            <div className="profile-row">
              <span className="label">Full Name:</span>
              <span className="value">{employee.firstName} {employee.lastName}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{employee.emailId}</span>
            </div>
            <div className="profile-row">
              <span className="label">
                <FaPhoneAlt className="icon" /> Phone:
              </span>
              <span className="value">{employee.phoneNumber || "N/A"}</span>
            </div>
            <div className="profile-row">
              <span className="label">
                <FaBriefcase className="icon" /> Department:
              </span>
              <span className="value">{employee.department}</span>
            </div>
            <div className="profile-row">
              <span className="label">Designation:</span>
              <span className="value">{employee.designation}</span>
            </div>
            <div className="profile-row">
              <span className="label">
                <FaCalendarAlt className="icon" /> Joining Date:
              </span>
              <span className="value">{new Date(employee.joiningDate).toLocaleDateString()}</span>
            </div>

            {employee.resumeFile && (
              <a
                href={`http://localhost:9090/${employee.resumeFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="user-resume-download"
              >
                <FaDownload className="download-icon" /> Download Resume
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
