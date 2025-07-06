import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";

const SalaryManagement = () => {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [payGrades, setPayGrades] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedPayGrade, setSelectedPayGrade] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [modalShow, setModalShow] = useState(false);

  const fetchAll = async () => {
    try {
      const salaryRes = await axios.get("/api/v1/salaries");
      setRecords(salaryRes.data);

      const empRes = await axios.get("/api/v1/employees");
      setEmployees(empRes.data);

      const pgRes = await axios.get("/api/paygrades");
      setPayGrades(pgRes.data);
    } catch (error) {
      setMessage("Error fetching data.");
      setModalShow(true);
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleGenerate = async () => {
    if (!selectedEmployee || !selectedPayGrade) {
      setMessage("Please select both employee and pay grade.");
      setModalShow(true);
      return;
    }
    try {
      await axios.post(
        `/api/v1/salaries/generate?employeeId=${selectedEmployee}&payGradeId=${selectedPayGrade}`
      );
      setMessage("Salary generated successfully.");
      setSelectedEmployee("");
      setSelectedPayGrade("");
      fetchAll();
    } catch (error) {
      setMessage("Error generating salary.");
      console.error(error);
    } finally {
      setModalShow(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // ✅ Updated for new DTO structure
  const filteredRecords = records.filter((s) => {
    const name = s.employeeName?.toLowerCase() || "";
    return (
      name.includes(searchTerm.toLowerCase()) ||
      s.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
          <Link to="/hr/salaries/manage" className="nav-item active">Salary Management</Link>
          <Link to="/hr/salaries/paygrade-form" className="nav-item">Paygrade Form</Link> 
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h3>Salary Management</h3>

        {/* Salary Generation Form */}
        <div className="form-section">
          <h5>Generate Salary</h5>
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
                <option key={pg.id} value={pg.id}>{pg.gradeName}</option>
              ))}
            </select>
          </div>
          <button className="btn-generate" onClick={handleGenerate}>Generate Salary</button>
        </div>

        {/* Search Bar */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
          <input
            type="text"
            placeholder="Search by employee name..."
            className="form-control w-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Salary Records Table */}
        <div className="table-responsive">
          <table className="table table-striped">
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
              {filteredRecords.length > 0 ? (
                filteredRecords.map((s, index) => (
                  <tr key={index}>
                    <td>{s.employeeName}</td>
                    <td>{s.payGradeName}</td>
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

        {/* Modal for messages */}
        <ConfirmationModal
          show={modalShow}
          message={message}
          onHide={() => setModalShow(false)}
        />
      </main>
    </div>
  );
};

export default SalaryManagement;
