import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import api from "../api";
import "./Employee.css";
import "./HRDashboard.css"; // Import to get the same sidebar styles

const AddEmployee = () => {
  const navigate = useNavigate();

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
      const formData = new FormData();
      formData.append(
        "employee",
        new Blob([JSON.stringify(formValues)], { type: "application/json" })
      );
      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (resumeFile) formData.append("resumeFile", resumeFile);

      await api.post("/employees/upload", formData);
      alert("Employee added successfully!");

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
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      alert("Add failed: " + message);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Updated Sidebar to match AdminDashboard */}
      <aside className="sidebar">
        <div className="brand">EmpowerDesk HR</div>
        <nav>
          <Link to="/hr/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/hr/add-employee-user" className="nav-item active">Add Employee & User</Link>
         
          <Link to="/hr/user-list" className="nav-item">User Management</Link>
          <Link to="/hr/manage-leaves" className="nav-item">Leave Requests</Link>
          <Link to="/hr/attendance" className="nav-item">Attendance Corrections</Link>
          <Link to="/hr/salaries/manage" className="nav-item">Salary Management</Link>
          <Link to="/hr/salaries/paygrade-form" className="nav-item">Paygrade Form</Link>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      <main className="main-content" style={{ flexGrow: 1, padding: "30px 40px", backgroundColor: "#f9fafb", overflowY: "auto" }}>
        <h2 className="section-title" style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "30px", color: "#1e293b" }}>Add New Employee</h2>
        <Card className="add-employee-card shadow">
          <Card.Body>
            <Form onSubmit={handleSubmit} noValidate>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formValues.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formValues.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="emailId">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="emailId"
                      value={formValues.emailId}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formValues.phoneNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="department">
                    <Form.Label>Department</Form.Label>
                    <Form.Select
                      name="department"
                      value={formValues.department}
                      onChange={handleChange}
                      required
                    >
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
                    <Form.Select
                      name="designation"
                      value={formValues.designation}
                      onChange={handleChange}
                      required
                    >
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
                      required
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="profilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                    {profilePreviewUrl && (
                      <img
                        src={profilePreviewUrl}
                        alt="Profile Preview"
                        className="preview-img mt-2"
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group controlId="resumeFile">
                    <Form.Label>Resume (PDF/DOC)</Form.Label>
                    <Form.Control
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-center mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      /> Saving...
                    </>
                  ) : (
                    "Save Employee"
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

export default AddEmployee;
