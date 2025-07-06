import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import InfoModal from "./InfoModal"; // Modal to show info/errors
import "./SalaryList.css";

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await axios.get("/api/v1/salaries");
        setSalaries(res.data);
      } catch (error) {
        setModalMessage("Error fetching salary records.");
        setModalShow(true);
        console.error("Error fetching salaries", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalaries();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  if (loading) return <p className="loading-text">Loading salaries...</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">⚙️ Panze hr</div>
        <nav>
          <Link to="/hr/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/hr/add-employee-user" className="nav-item active">Add Employee & User</Link>
        
          <Link to="/hr/user-list" className="nav-item">User Management</Link>
          <Link to="/hr/manage-leaves" className="nav-item">Leave Requests</Link>
          <Link to="/hr/salaries/generate" className="nav-item">Generate Salary</Link>
          <Link to="/hr/salaries/list" className="nav-item active">Salary Records</Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h3>Salary Records</h3>
        <div className="table-responsive">
          <table className="salary-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Pay Grade</th>
                <th>Gross Salary</th>
                <th>Net Salary</th>
                <th>Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length > 0 ? (
                salaries.map((s) => (
                  <tr key={s.id}>
                    <td>{s.employee?.firstName} {s.employee?.lastName}</td>
                    <td>{s.payGrade?.gradeName}</td>
                    <td>{s.grossSalary}</td>
                    <td>{s.netSalary}</td>
                    <td>{new Date(s.payDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No salary records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info modal */}
        <InfoModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          message={modalMessage}
        />
      </main>
    </div>
  );
};

export default SalaryList;
