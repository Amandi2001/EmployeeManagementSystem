import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // 🧹 Removed Spinner

const UserModal = ({ show, onHide, onSave, user }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, password: "", role: user.role });
    } else {
      setFormData({ username: "", password: "", role: "" });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user ? "Edit User" : "Add User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Password {user && "(Leave blank to keep current)"}
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={user ? "••••••" : ""}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_HR">HR</option>
              <option value="ROLE_USER">User</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {user ? "Update User" : "Add User"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
