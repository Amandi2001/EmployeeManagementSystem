import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Employee.css"; // ensure it includes the updated sidebar styles
import { FaSignOutAlt } from "react-icons/fa";

// ✅ Updated Sidebar Component (Admin style)
const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  return (
    <div
      className="sidebar"
     
    >
      <div>
        
           <div className="brand">EmpowerDesk Admin</div>
       
        <nav style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/admin/dashboard" className={`nav-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link to="/admin/add-employee-user" className={`nav-item ${location.pathname === "/admin/add-employee-user" ? "active" : ""}`}>
            Add Employee & User
          </Link>
          <Link to="/admin/manage-employees" className={`nav-item ${location.pathname === "/admin/manage-employees" ? "active" : ""}`}>
            Manage Employees
          </Link>
          <Link to="/admin/user-list" className={`nav-item ${location.pathname === "/admin/user-list" ? "active" : ""}`}>
            User List
          </Link>
          <Link to="/admin/manage-leaves" className={`nav-item ${location.pathname === "/admin/manage-leaves" ? "active" : ""}`}>
            Leave Requests
          </Link>
          <Link to="/admin/salaries/generate" className={`nav-item ${location.pathname === "/admin/salaries/generate" ? "active" : ""}`}>
            Generate Salary
          </Link>
          <Link to="/admin/salaries/list" className={`nav-item ${location.pathname === "/admin/salaries/list" ? "active" : ""}`}>
            Salary Records
          </Link>
        </nav>
      </div>

      <div style={{ padding: "20px" }}>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

const AddEmployeeWithUser = () => {
  const navigate = useNavigate();

  // User fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");

  // Employee fields
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNumber: "",
    department: "",
    designation: "",
    joiningDate: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profilePicture) {
      setProfilePreviewUrl(null);
      return;
    }
    const previewUrl = URL.createObjectURL(profilePicture);
    setProfilePreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [profilePicture]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        username,
        password,
        role,
        employee: { ...formValues },
      };

      const formData = new FormData();
      formData.append(
        "data",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (resumeFile) formData.append("resumeFile", resumeFile);

      await axios.post("http://localhost:9090/api/v1/employees-with-user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Employee and User created successfully!");

      // Reset form
      setUsername("");
      setPassword("");
      setRole("ROLE_USER");
      setFormValues({
        firstName: "",
        lastName: "",
        emailId: "",
        phoneNumber: "",
        department: "",
        designation: "",
        joiningDate: "",
      });
      setProfilePicture(null);
      setResumeFile(null);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Error creating employee and user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ display: "flex" }}>
      <Sidebar onLogout={handleLogout} />
      <main className="main-content" style={{ flex: 1, padding: "30px" }}>
        <h2 className="section-title">Add New Employee & User</h2>
        <Card className="add-employee-card shadow">
          <Card.Body>
            <Form onSubmit={handleSubmit} noValidate>
              <h4>User Details</h4>
              <Row className="g-3 mb-4">
                <Col md={4}>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="ROLE_ADMIN">Admin</option>
                      <option value="ROLE_HR">HR</option>
                      <option value="ROLE_USER">User</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <h4>Employee Details</h4>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control name="firstName" type="text" value={formValues.firstName} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control name="lastName" type="text" value={formValues.lastName} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="emailId">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="emailId" type="email" value={formValues.emailId} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control name="phoneNumber" type="tel" value={formValues.phoneNumber} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="department">
                    <Form.Label>Department</Form.Label>
                    <Form.Select name="department" value={formValues.department} onChange={handleChange} required>
                      <option value="">Select Department</option>
                      <option>Human Resources</option>
                      <option>Finance</option>
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>Customer Support</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="designation">
                    <Form.Label>Designation</Form.Label>
                    <Form.Select name="designation" value={formValues.designation} onChange={handleChange} required>
                      <option value="">Select Designation</option>
                      <option>Intern</option>
                      <option>Junior Developer</option>
                      <option>Senior Developer</option>
                      <option>Manager</option>
                      <option>Team Lead</option>
                      <option>Director</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="joiningDate">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="joiningDate"
                      value={formValues.joiningDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="profilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files[0])} />
                    {profilePreviewUrl && (
                      <img src={profilePreviewUrl} alt="Preview" className="preview-img mt-2" style={{ maxHeight: "100px", borderRadius: "6px" }} />
                    )}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="resumeFile">
                    <Form.Label>Resume (PDF/DOC)</Form.Label>
                    <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button variant="primary" type="submit" disabled={loading} className="px-5 py-3" size="lg">
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Saving...
                    </>
                  ) : (
                    "Save Employee & User"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
};

export default AddEmployeeWithUser;
