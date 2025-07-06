import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import EmployeeModal from "./EmployeeModal";

const fileBaseURL = "http://localhost:9090/";

const EmployeeList = () => {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    department: "",
    designation: "",
    status: "",
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

      if (filters.firstName) params.append("firstName", filters.firstName);
      if (filters.lastName) params.append("lastName", filters.lastName);
      if (filters.emailId) params.append("emailId", filters.emailId);
      if (filters.department) params.append("department", filters.department);
      if (filters.designation) params.append("designation", filters.designation);
      if (filters.status) params.append("status", filters.status);

      const url =
        params.toString().length > 0
          ? `/employees/search?${params.toString()}`
          : "/employees";

      const res = await api.get(url);
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to fetch employees");
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchEmployees();
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowModal(true);
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
      if (selectedEmployee && selectedEmployee.id) {
        // NOTE: DO NOT set Content-Type header manually when sending FormData
        await api.put(`/employees/${selectedEmployee.id}/upload`, formData);
      } else {
        await api.post("/employees/upload", formData);
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert("Save failed: " + (err.response?.data || err.message));
      console.error(err);
    }
  };

  return (
    <>
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        + Add Employee
      </button>

      <div className="row g-2 mb-3">
        <div className="col">
          <input
            type="text"
            name="firstName"
            value={filters.firstName}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="First Name"
          />
        </div>
        <div className="col">
          <input
            type="text"
            name="lastName"
            value={filters.lastName}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Last Name"
          />
        </div>
        <div className="col">
          <input
            type="email"
            name="emailId"
            value={filters.emailId}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Email"
          />
        </div>
        <div className="col">
          <input
            type="text"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Department"
          />
        </div>
        <div className="col">
          <input
            type="text"
            name="designation"
            value={filters.designation}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Designation"
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <table className="table table-striped table-bordered">
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
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>
                    {emp.profilePicture ? (
                      <img
                        src={`${fileBaseURL}${emp.profilePicture}`}
                        alt="Profile"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.emailId}</td>
                  <td>{emp.phoneNumber || "-"}</td>
                  <td>{emp.department || "-"}</td>
                  <td>{emp.designation || "-"}</td>
                  <td>
                    {emp.joiningDate
                      ? new Date(emp.joiningDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {emp.resumeFile ? (
                      <a
                        href={`${fileBaseURL}${emp.resumeFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/employees/${emp.id}`}
                      className="btn btn-info btn-sm"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <EmployeeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        employee={selectedEmployee}
      />
    </>
  );
};

export default EmployeeList;
