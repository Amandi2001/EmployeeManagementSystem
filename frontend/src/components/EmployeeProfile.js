import React, { useState, useEffect } from "react";
import { Tabs } from "react-bootstrap"; // or custom tabs
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmployeeProfile = () => {
  const { id } = useParams(); // get employee ID from route
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:9090/api/v1/employees/${id}`)
      .then((res) => {
        setEmployee(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <div className="d-flex align-items-center">
          <img
            src={employee.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="rounded-circle me-3"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
          <div>
            <h4>{employee.firstName} {employee.lastName}</h4>
            <p>{employee.designation} - {employee.department}</p>
          </div>
        </div>

        <Tabs defaultActiveKey="profile" className="mt-4">
          <Tab eventKey="profile" title="Profile">
            <p><strong>Email:</strong> {employee.emailId}</p>
            <p><strong>Phone:</strong> {employee.phoneNumber}</p>
            <p><strong>Joining Date:</strong> {employee.joiningDate}</p>
          </Tab>
          <Tab eventKey="projects" title="Projects">
            {/* Replace with actual project list */}
            <p>No projects assigned.</p>
          </Tab>
          <Tab eventKey="leave" title="Leave">
            {/* Replace with leave data */}
            <p>No leave records.</p>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
