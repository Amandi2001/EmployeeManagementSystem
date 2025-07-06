import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import EmployeeModal from "./EmployeeModal";
import "./EmployeeList.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaSignOutAlt } from "react-icons/fa";

const fileBaseURL = "http://localhost:9090/";

// Sidebar component for Admin
const Sidebar = ({ onLogout }) => (
  <aside className="sidebar">
    <div className="brand">EmpowerDesk Admin</div>
    <nav>
      <Link to="/admin/dashboard" className="nav-item">Dashboard</Link>
      <Link to="/admin/add-employee-user" className="nav-item">Add Employee & User</Link>
      <Link to="/admin/manage-employees" className="nav-item active">Manage Employees</Link>
      <Link to="/admin/user-list" className="nav-item">User Management</Link>
      <Link to="/admin/manage-leaves" className="nav-item">Leave Requests</Link>
      <Link to="/admin/attendance" className="nav-item">Attendance Corrections</Link>
      <Link to="/admin/salaries/manage" className="nav-item">Salary Management</Link>
      <Link to="/admin/salaries/paygrade-form" className="nav-item">Paygrade Form</Link>
      <button className="logout-btn" onClick={onLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </nav>
  </aside>
);

const EmployeeList = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    department: "",
    designation: "",
  });

  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = params.toString() ? `/employees/search?${params.toString()}` : "/employees";
      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch {
        alert("Delete failed");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedEmployee?.id) {
        await api.put(`/employees/${selectedEmployee.id}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/employees/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert("Save failed: " + (err.response?.data || err.message));
    }
  };

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={onLogout} />

      <main className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Manage Employees</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Employee</button>
        </div>

        <div className="filter-bar mb-3 d-flex flex-wrap gap-2">
          <input
            name="firstName"
            placeholder="First Name"
            value={filters.firstName}
            onChange={handleFilterChange}
            className="form-control"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            value={filters.lastName}
            onChange={handleFilterChange}
            className="form-control"
          />
          <input
            name="emailId"
            placeholder="Email"
            value={filters.emailId}
            onChange={handleFilterChange}
            className="form-control"
          />
          <input
            name="department"
            placeholder="Department"
            value={filters.department}
            onChange={handleFilterChange}
            className="form-control"
          />
          <input
            name="designation"
            placeholder="Designation"
            value={filters.designation}
            onChange={handleFilterChange}
            className="form-control"
          />
          <button className="btn btn-info text-white" onClick={fetchEmployees} disabled={loading}>
            {loading ? <i className="bi bi-arrow-repeat spin"></i> : <i className="bi bi-search"></i>} Search
          </button>
        </div>

        <div className="card">
          <div className="card-header"><strong>Employee List</strong></div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
              <table className="table table-hover text-center">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Photo</th>
                    <th>First</th>
                    <th>Last</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Joining Date</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length ? employees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{index + 1}</td>
                      <td>
                        {emp.profilePicture ? (
                          <img src={`${fileBaseURL}${emp.profilePicture}`} alt={emp.firstName} className="emp-photo" />
                        ) : "-"}
                      </td>
                      <td>{emp.firstName}</td>
                      <td>{emp.lastName}</td>
                      <td>{emp.emailId}</td>
                      <td>{emp.phoneNumber || "-"}</td>
                      <td>{emp.department || "-"}</td>
                      <td>{emp.designation || "-"}</td>
                      <td>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "-"}</td>
                      <td>
                        {emp.resumeFile ? (
                          <a href={`${fileBaseURL}${emp.resumeFile}`} target="_blank" rel="noopener noreferrer">View</a>
                        ) : "-"}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(emp)}><i className="bi bi-pencil-fill" /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}><i className="bi bi-trash-fill" /></button>
                          <Link to={`/employees/${emp.id}`} className="btn btn-sm btn-success"><i className="bi bi-eye-fill" /></Link>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="11">No employees found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <EmployeeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
          employee={selectedEmployee}
        />
      </main>
    </div>
  );
};

export default EmployeeList;
