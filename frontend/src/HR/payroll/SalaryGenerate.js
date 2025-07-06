import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal"; // We'll define this below
import "./SalaryGenerate.css";

const SalaryGenerate = () => {
  const [employees, setEmployees] = useState([]);
  const [payGrades, setPayGrades] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedPayGrade, setSelectedPayGrade] = useState("");
  const [message, setMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await axios.get("/api/v1/employees");
        setEmployees(empRes.data);

        const pgRes = await axios.get("/api/paygrades");
        setPayGrades(pgRes.data);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, []);


  

  const handleGenerate = async () => {
    if (!selectedEmployee || !selectedPayGrade) {
      setMessage("Please select employee and pay grade.");
      setModalShow(true);
      return;
    }
    try {
     await axios.post(
  `/api/v1/salaries/generate?employeeId=${selectedEmployee}&payGradeId=${selectedPayGrade}`
);

      setMessage("Salary generated successfully.");
      setModalShow(true);
      // reset selections optionally
      setSelectedEmployee("");
      setSelectedPayGrade("");
    } catch (error) {
      setMessage("Error generating salary.");
      setModalShow(true);
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
        <div className="brand">⚙️ Panze hr</div>
        <nav>
          <Link to="/hr/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/hr/add-employee-user" className="nav-item active">Add Employee & User</Link>
          <Link to="/hr/manage-employees" className="nav-item active">Manage Employees</Link>
         
          <Link to="/hr/user-list" className="nav-item">User Management</Link>
          <Link to="/hr/manage-leaves" className="nav-item">Leave Requests</Link>
          <Link to="/hr/salaries/generate" className="nav-item active">Generate Salary</Link>
          <Link to="/hr/salaries/list" className="nav-item">Salary Records</Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h3>Generate Salary</h3>
        <div className="form-group">
          <label>Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Pay Grade:</label>
          <select
            value={selectedPayGrade}
            onChange={(e) => setSelectedPayGrade(e.target.value)}
          >
            <option value="">-- Select Pay Grade --</option>
            {payGrades.map((pg) => (
              <option key={pg.id} value={pg.id}>
                {pg.gradeName}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-generate" onClick={handleGenerate}>
          Generate Salary
        </button>

        {/* Confirmation modal for messages */}
        <ConfirmationModal
          show={modalShow}
          message={message}
          onHide={() => setModalShow(false)}
        />
      </main>
    </div>
  );
};

export default SalaryGenerate;
