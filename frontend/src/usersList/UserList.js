import React, { useState, useEffect } from "react";
import api from "../api";
import UserModal from "./UserModal";
import { Table, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  
} from "react-icons/fa";
import "../styles/Sidebar.css"; // Your CSS for sidebar styling

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ username: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch {
        alert("Failed to delete user");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, formData);
      } else {
        await api.post("/users", formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert("Failed to save user");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter((u) => {
    return (
      u.username.toLowerCase().includes(filters.username.toLowerCase()) &&
      (filters.role === "" || u.role === filters.role)
    );
  });

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">EmpowerDesk Admin</div>
        <nav>
                  <Link to="/admin/dashboard" className="nav-item ">Dashboard</Link>
                  <Link to="/admin/add-employee-user" className="nav-item ">Add Employee & User</Link>
                  <Link to="/admin/manage-employees" className="nav-item">Manage Employees</Link>
                  <Link to="/admin/user-list" className="nav-item active ">Users Management</Link>
                  <Link to="/admin/manage-leaves" className="nav-item">Leave Requests</Link>
                  <Link to="/admin/salaries/generate" className="nav-item">Generate Salary</Link>
                  <Link to="/admin/salaries/list" className="nav-item">Salary Records</Link>
                  <Link to="/admin/salaries/paygrade-form" className="nav-item">Paygrade Form</Link> 
                  <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>User Management</h3>
          <Button onClick={handleAdd}>+ Add User</Button>
        </div>

        <Row className="g-2 mb-3">
          <Col md={4}>
            <Form.Control
              type="text"
              name="username"
              placeholder="Search Username"
              value={filters.username}
              onChange={handleFilterChange}
            />
          </Col>
          <Col md={4}>
            <Form.Select name="role" value={filters.role} onChange={handleFilterChange}>
              <option value="">All Roles</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_HR">HR</option>
              <option value="ROLE_USER">User</option>
            </Form.Select>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.role}</td>
                    <td>
                      <Button size="sm" variant="warning" onClick={() => handleEdit(u)}>
                        Edit
                      </Button>{" "}
                      <Button size="sm" variant="danger" onClick={() => handleDelete(u.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No users found</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        <UserModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSave}
          user={selectedUser}
        />
      </main>
    </div>
  );
};

export default UserManagement;
