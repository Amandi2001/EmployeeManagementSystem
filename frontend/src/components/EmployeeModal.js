import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const EmployeeModal = ({ show, onHide, onSave, employee }) => {
  // User state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");

  // Employee state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName || "");
      setLastName(employee.lastName || "");
      setEmailId(employee.emailId || "");
      setPhoneNumber(employee.phoneNumber || "");
      setDepartment(employee.department || "");
      setDesignation(employee.designation || "");
      setJoiningDate(employee.joiningDate ? employee.joiningDate.slice(0, 10) : "");

      setUsername(employee.user?.username || "");
      setPassword(""); // Do not prefill password
      setRole(employee.user?.role || "ROLE_USER");
    } else {
      setFirstName("");
      setLastName("");
      setEmailId("");
      setPhoneNumber("");
      setDepartment("");
      setDesignation("");
      setJoiningDate("");

      setUsername("");
      setPassword("");
      setRole("ROLE_USER");
    }

    setProfilePicture(null);
    setResumeFile(null);
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const employeeData = {
      id: employee?.id,
      firstName,
      lastName,
      emailId,
      phoneNumber,
      department,
      designation,
      joiningDate,
    };

    const userData = {
      username,
      password,
      role,
    };

    const payload = {
      employee: employeeData,
      user: userData,
    };

    const formData = new FormData();
    // Use key "data" for your JSON payload — make sure backend expects this key!
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    if (profilePicture) formData.append("profilePicture", profilePicture);
    if (resumeFile) formData.append("resumeFile", resumeFile);

    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{employee ? "Edit Employee & User" : "Add Employee & User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* User Details */}
          <h5 className="mb-3">User Details</h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={employee ? "••••••" : ""}
                  required={!employee}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_HR">HR</option>
                  <option value="ROLE_USER">User</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Employee Details */}
          <h5 className="mt-4 mb-3">Employee Details</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              pattern="[0-9\s\(\)\+\-]*"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
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
              <Form.Group className="mb-3">
                <Form.Label>Designation</Form.Label>
                <Form.Select
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
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
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Joining Date</Form.Label>
            <Form.Control
              type="date"
              required
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="preview"
                style={{ maxHeight: "80px", marginTop: "10px" }}
              />
            ) : employee?.profilePicture ? (
              <img
                src={`http://localhost:9090/${employee.profilePicture}`}
                alt="current"
                style={{ maxHeight: "80px", marginTop: "10px" }}
              />
            ) : null}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Resume</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            {employee?.resumeFile && !resumeFile && (
              <p style={{ marginTop: "5px" }}>
                Current:{" "}
                <a
                  href={`http://localhost:9090/${employee.resumeFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
              </p>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
